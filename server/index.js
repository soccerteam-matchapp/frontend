// server/index.js
const express = require('express');
const session = require('cookie-session');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// 임시 "DB" (메모리) - 실제 배포 전엔 DB로 바꿀 것
const users = []; // { id, name, pwHash }

app.use(express.json());

// 개발용: 프론트(3000)에서 오는 요청 허용
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// 쿠키 설정
app.use(
  session({
    name: 'tm.sid',
    keys: ['change-this-to-env'], // 나중에 환경변수로 빼기
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // https 배포 시 true
  })
);

// 1) 아이디 중복 확인
app.get('/api/auth/check-id', (req, res) => {
  const value = (req.query.value || '').trim();
  if (!value) return res.status(400).json({ message: 'value가 필요합니다.' });

  const exists = users.some((u) => u.id.toLowerCase() === value.toLowerCase());
  return res.json({ available: !exists }); // true면 사용가능
});

// 2) 회원가입
app.post('/api/auth/register', async (req, res) => {
  const { name, id, password } = req.body || {};
  const errors = {};

  // 간단한 체크 (프론트와 동일 기준)
  if (!name || !name.trim()) errors.name = '이름을 입력하세요.';
  if (!id || id.length < 4 || id.length > 12 || !/^[a-zA-Z0-9]+$/.test(id))
    errors.id = '아이디 형식이 올바르지 않습니다.';
  if (!password || password.length < 8)
    errors.password = '비밀번호는 8자 이상이어야 합니다.';

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: '검증 오류', errors });
  }

  // 중복 체크
  const exists = users.some((u) => u.id.toLowerCase() === id.toLowerCase());
  if (exists) {
    return res.status(409).json({
      message: '이미 사용 중인 아이디입니다.',
      errors: { id: '이미 사용 중인 아이디입니다.' },
    });
  }

  const pwHash = await bcrypt.hash(password, 10);
  const user = { id, name, pwHash };
  users.push(user);

  // 가입과 동시에 로그인 상태로 만들기
  req.session.user = { id, name };
  return res.status(201).json({ user: { id, name } });
});

// (옵션) 로그인/로그아웃
app.post('/api/auth/login', async (req, res) => {
  const { id, password } = req.body || {};
  const user = users.find(
    (u) => u.id.toLowerCase() === (id || '').toLowerCase()
  );
  if (!user)
    return res
      .status(401)
      .json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });

  const ok = await bcrypt.compare(password, user.pwHash);
  if (!ok)
    return res
      .status(401)
      .json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });

  req.session.user = { id: user.id, name: user.name };
  return res.json({ user: { id: user.id, name: user.name } });
});

app.post('/api/auth/logout', (req, res) => {
  req.session = null;
  return res.status(204).end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));

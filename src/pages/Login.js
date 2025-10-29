import { useState } from 'react';

export default function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    alert(`로그인 시도: ${id}`);
  };

  return (
    <div className="screen">
      <div className="statusbar" />

      {/* 상단 문구 */}
      <div className="hand">스포츠를 손쉽게</div>

      <h1 className="brand">
        <span>S</span>
        <span className="dark">p</span>
        <span>o</span>
        <span className="dark">r</span>
        <span>t</span>
        <span className="dark">l</span>
        <span>y</span>
      </h1>
      <div className="sub-brand">스포츨리</div>

      <form className="form" onSubmit={onSubmit}>
        {/* 아이디 */}
        <label className="field">
          <span className="label">아이디</span>
          <div className="input-wrap">
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디"
              autoComplete="username"
            />
            {id && (
              <button type="button" className="clear" onClick={() => setId('')}>
                ×
              </button>
            )}
          </div>
        </label>

        {/* 비밀번호 */}
        <label className="field">
          <span className="label">비밀번호</span>
          <div className="input-wrap">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
            />
            {pw && (
              <button type="button" className="clear" onClick={() => setPw('')}>
                ×
              </button>
            )}
          </div>
        </label>

        {/* 로그인 버튼 */}
        <button className="primary-btn" type="submit" disabled={!id || !pw}>
          로그인
        </button>
      </form>

      {/* 회원가입 링크 */}
      <div className="switch-link">
        아이디가 없으신가요? <a href="/signup">회원가입</a>
      </div>
    </div>
  );
}

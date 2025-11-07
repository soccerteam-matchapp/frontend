import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth';
export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [loginError, setLoginError] = useState(''); // 에러 메시지 상태 추가

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!id || !pw) return;

    // 데이터 구조 일치: API는 id와 password를 받도록 구현됨
    const payload = { id: id.trim(), password: pw };

    setLoading(true);
    try {
      // 실제 서버 API 호출
      const response = await loginApi(payload); // 인증 정보 저장 (토큰 저장)
      // 서버 응답 구조가 { data: { accessToken: "..." } } 이므로, 이렇게 접근
      const token = response.data.accessToken;
      localStorage.setItem('userToken', token); // 💡 5. 홈 화면으로 이동
      navigate('/home', { replace: true });
    } catch (error) {
      // 에러 처리 (API 모듈에서 던진 Error 객체를 받음)
      const errorMessage =
        error.message || '로그인 중 알 수 없는 오류가 발생했습니다.';
      setLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <div className="statusbar" />

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
        <button
          className="primary-btn"
          type="submit"
          disabled={!id || !pw || loading}
        >
          {loading ? '로그인 중...' : '로그인'}{' '}
        </button>
      </form>

      {/* 회원가입 링크 */}
      <div className="switch-link">
        아이디가 없으신가요? <a href="/signup">회원가입</a>
      </div>
    </div>
  );
}

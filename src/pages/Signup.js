import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerApi } from '../api/auth'; //새로 추가한 API 파일 임포트

function validateId(id) {
  if (id.length < 4 || id.length > 12) return '아이디는 4~12자여야 합니다.';
  if (!/^[a-zA-Z0-9]+$/.test(id))
    return '아이디는 영문/숫자 조합만 가능합니다.';
  return '';
}

function validatePw(pw) {
  if (pw.length < 8 || pw.length > 16) return '비밀번호는 8~16자여야 합니다.';
  if (!/(?=.*[A-Za-z])/.test(pw))
    return '비밀번호에는 영문이 최소 1개 포함되어야 합니다.';
  if (!/(?=.*\d)/.test(pw))
    return '비밀번호에는 숫자가 최소 1개 포함되어야 합니다.';
  return '';
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', id: '', pw: '', pw2: '' });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // 요청 취소(선택): 빠르게 페이지 이동 시 불필요 요청 중단
  const controllerRef = useRef(null);
  useEffect(() => () => controllerRef.current?.abort(), []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'id') {
      setFieldErrors((prev) => ({ ...prev, id: '' }));
    }
  };

  const clear = (key) => {
    setForm((prev) => ({ ...prev, [key]: '' }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const idError = validateId(form.id);
  const pwError = validatePw(form.pw);
  const pw2Error =
    form.pw && form.pw2 && form.pw !== form.pw2
      ? '비밀번호가 일치하지 않습니다.'
      : '';
  const nameError = form.name.trim() === '' ? '이름을 입력하세요.' : '';

  const allFilled =
    form.name.trim() !== '' &&
    form.id.trim() !== '' &&
    form.pw.trim() !== '' &&
    form.pw2.trim() !== '';

  const canSubmit =
    allFilled &&
    !idError &&
    !pwError &&
    !pw2Error &&
    !nameError &&
    !isSubmitting;

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  // 서버 연동으로 변경: 회원가입
  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    setTouched({ name: true, id: true, pw: true, pw2: true });
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      // 서버로 보낼 payload 최소화
      const payload = {
        name: form.name.trim(),
        id: form.id.trim().toLowerCase(),
        password: form.pw,
      };
      await registerApi(payload, { signal: controllerRef.current.signal });
      alert('회원가입이 완료되었습니다!');
      navigate('/login', { replace: true });
    } catch (err) {
      if (err.name === 'AbortError') return;

      // 서버가 필드 단위 에러를 내려줄 수 있어 매핑 처리
      // 예: { errors: { id: '이미 사용 중', password: '너무 약함' }, message: '검증 오류' }
      if (err.fields) {
        setFieldErrors((prev) => ({ ...prev, ...err.fields }));
      }
      setFormError(
        err.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSubmitting(false);
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

      <form className="form" onSubmit={onSubmit} noValidate>
        {formError && (
          <div className="form-error" role="alert" aria-live="assertive">
            {formError}
          </div>
        )}

        <label className="field">
          <span className="label">이름</span>
          <div className="input-wrap">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              onBlur={onBlur}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {form.name && (
              <button
                type="button"
                className="clear"
                onClick={() => clear('name')}
                disabled={isSubmitting}
              >
                ×
              </button>
            )}
          </div>
          {touched.name && nameError && (
            <small className="error">{nameError}</small>
          )}
        </label>

        <label className="field">
          <span className="label">아이디</span>
          <div className="input-wrap">
            <input
              name="id"
              value={form.id}
              onChange={onChange}
              onBlur={onBlur}
              disabled={isSubmitting}
              placeholder="영문/숫자 4~12자"
              autoComplete="username"
              inputMode="text"
            />
            {form.id && (
              <button
                type="button"
                className="clear"
                onClick={() => clear('id')}
                disabled={isSubmitting}
                aria-label="아이디 지우기"
              >
                ×
              </button>
            )}
          </div>

          {/* 서버/클라 검증 메시지 */}
          {touched.id && (fieldErrors.id || idError) && (
            <small className="error">{fieldErrors.id || idError}</small>
          )}
        </label>

        {/* 비밀번호 */}
        <label className="field">
          <span className="label">비밀번호</span>
          <div className="input-wrap">
            <input
              type="password"
              name="pw"
              value={form.pw}
              onChange={onChange}
              onBlur={onBlur}
              disabled={isSubmitting}
              placeholder="영문+숫자 8~16자"
              autoComplete="new-password"
            />
            {form.pw && (
              <button
                type="button"
                className="clear"
                onClick={() => clear('pw')}
                disabled={isSubmitting}
              >
                ×
              </button>
            )}
          </div>
          {touched.pw && pwError && <small className="error">{pwError}</small>}
        </label>

        {/* 비밀번호 확인 */}
        <label className="field">
          <span className="label">비밀번호 확인</span>
          <div className="input-wrap">
            <input
              type="password"
              name="pw2"
              value={form.pw2}
              onChange={onChange}
              onBlur={onBlur}
              disabled={isSubmitting}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
            />
            {form.pw2 && (
              <button
                type="button"
                className="clear"
                onClick={() => clear('pw2')}
                disabled={isSubmitting}
              >
                ×
              </button>
            )}
          </div>
          {touched.pw2 && pw2Error && (
            <small className="error">{pw2Error}</small>
          )}
        </label>

        <button
          className="primary-btn"
          type="submit"
          disabled={!canSubmit || isSubmitting}
          aria-busy={isSubmitting || undefined}
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>
      </form>

      {/* 로그인으로 이동 링크 */}
      <div className="switch-link">
        아이디가 있으신가요? <a href="/login">로그인</a>
      </div>
    </div>
  );
}

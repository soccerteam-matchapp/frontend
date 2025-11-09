import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerApi } from '../api/auth'; //새로 추가한 API 파일 임포트
// import { checkIdApi } from '../api/auth'; // 중복확인 API가 있다면 임포트, 서버 연결 후 주석 제거

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
  const [isIdChecked, setIsIdChecked] = useState(false); //아이디 중복확인 상태
  const [isIdChecking, setIsIdChecking] = useState(false); // 중복확인 로딩 상태

  // 요청 취소: 빠르게 페이지 이동 시 불필요 요청 중단
  const controllerRef = useRef(null);
  useEffect(() => () => controllerRef.current?.abort(), []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'id') {
      setFieldErrors((prev) => ({ ...prev, id: '' }));
      setIsIdChecked(false);
    }
  };

  const clear = (key) => {
    setForm((prev) => ({ ...prev, [key]: '' }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    if (key === 'id') {
      setIsIdChecked(false);
    }
  };

  const idError = validateId(form.id);
  const pwError = validatePw(form.pw);
  const pw2Error =
    form.pw && form.pw2 && form.pw !== form.pw2
      ? '비밀번호가 일치하지 않습니다.'
      : '';
  const nameError = form.name.trim() === '' ? '이름을 입력하세요.' : '';
  //아이디 중복확인 함수 (임시 로직)
  const onCheckId = async () => {
    // 클라이언트 유효성 검사 통과 여부 확인
    if (idError) {
      setTouched((t) => ({ ...t, id: true }));
      return;
    }

    setIsIdChecking(true);
    setFormError('');
    setFieldErrors((p) => ({ ...p, id: '' }));

    try {
      //(임시) 서버 통신 시뮬레이션: 0.8초 지연
      await new Promise((resolve) => setTimeout(resolve, 800)); //실제 API 호출: await checkIdApi(form.id); //성공 처리 (사용 가능)
      setIsIdChecked(true);
    } catch (err) {
      //실패 처리 (중복 또는 서버 오류)
      setIsIdChecked(false);
      if (err.message === 'Duplicate ID') {
        setFieldErrors((p) => ({ ...p, id: '이미 사용 중인 아이디입니다.' }));
      } else {
        setFormError(err.message || '중복확인 중 서버 오류가 발생했습니다.');
      }
    } finally {
      setIsIdChecking(false);
    }
  };

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
    !isSubmitting &&
    isIdChecked;

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
      //controllerRef.current?.abort(); //서버 연결 후 주석 제거.
      //controllerRef.current = new AbortController(); //동일.

      await new Promise((resolve) => setTimeout(resolve, 500)); //서버 연결 전 로딩 상태 테스트용

      // 서버로 보낼 payload 최소화
      /*const payload = {
        name: form.name.trim(),
        id: form.id.trim().toLowerCase(),
        password: form.pw,
      };
      await registerApi(payload, { signal: controllerRef.current.signal });*/ //임시 주석처리
      alert('회원가입이 완료되었습니다!'); //임시
      navigate('/login', { replace: true });
    } catch (err) {
      if (err.name === 'AbortError') return;

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
          <div className="label-group">
            <span className="label">아이디</span>
            <button
              type="button"
              className="check-btn"
              onClick={onCheckId}
              disabled={
                !form.id ||
                !!idError ||
                isSubmitting ||
                isIdChecking ||
                isIdChecked
              }
            >
              {isIdChecking
                ? '확인 중'
                : isIdChecked
                ? '확인 완료'
                : '중복확인'}
            </button>
          </div>
          <div className="input-wrap">
            <input
              name="id"
              value={form.id}
              onChange={onChange}
              onBlur={onBlur}
              disabled={isSubmitting || isIdChecking}
              placeholder="영문/숫자 4~12자"
              autoComplete="username"
              inputMode="text"
            />
            {form.id && (
              <button
                type="button"
                className="clear"
                onClick={() => clear('id')}
                disabled={isSubmitting || isIdChecking}
                aria-label="아이디 지우기"
              >
                ×
              </button>
            )}
          </div>

          {/* 서버/클라 검증 메시지 및 중복확인 안내 */}
          {touched.id && (fieldErrors.id || idError) ? (
            <small className="error">{fieldErrors.id || idError}</small>
          ) : touched.id && isIdChecked && !fieldErrors.id ? (
            <small className="success">사용 가능한 아이디입니다.</small>
          ) : touched.id && form.id && !isIdChecked ? (
            <small className="info">중복확인 버튼을 눌러주세요.</small>
          ) : null}
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
              disabled={isSubmitting || isIdChecking}
              placeholder="영문+숫자 8~16자"
              autoComplete="new-password"
            />
            {form.pw && (
              <button
                type="button"
                className="clear"
                onClick={() => clear('pw')}
                disabled={isSubmitting || isIdChecking}
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

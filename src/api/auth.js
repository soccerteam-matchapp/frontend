import http from './http';

export async function registerApi(payload, { signal } = {}) {
  try {
    const res = await http.post('/auth/register', payload, { signal });
    // 성공 조건: 2xx + { success: true }
    if (res.status >= 200 && res.status < 300 && res.data?.success === true) {
      return res.data; // { success: true, ... }
    }
    throw new Error('회원가입에 실패했습니다.');
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const msg =
      data?.message ||
      (status === 409
        ? '이미 존재하는 아이디입니다.'
        : '회원가입에 실패했습니다.');
    const e = new Error(msg);
    if (status === 409) e.fields = { id: '이미 존재하는 아이디입니다.' };
    throw e;
  }
}

// 로그인/리프레시도 동일하게 상대경로 유지
export async function loginApi({ id, password }, { signal } = {}) {
  const res = await http.post('/auth/login', { id, password }, { signal });
  if (res.status >= 200 && res.status < 300 && res.data?.data?.accessToken)
    return res.data;
  throw new Error(res.data?.message || '로그인에 실패했습니다.');
}

export async function refreshTokenApi(refreshToken, { signal } = {}) {
  const res = await http.post('/auth/refresh', { refreshToken }, { signal });
  if (res.status >= 200 && res.status < 300 && res.data?.data?.accessToken)
    return res.data;
  throw new Error(res.data?.message || '토큰 재발급에 실패했습니다.');
}

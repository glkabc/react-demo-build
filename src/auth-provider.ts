import { ApiResponse } from 'types';

interface AuthInformation {
  token: string;
  expireTime: number;
  user: any;
  modules: any[];
}

export interface PersistentAuthInformation
  extends Omit<AuthInformation, 'expireTime'> {
  expiredAt: number;
}

const authURL = process.env.REACT_APP_AUTH_URL;
const persistentKey = '__baide_document_auth_provider_token__';

async function client<T>(endpoint: string, data?: any) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const response = await window.fetch(`${authURL}/${endpoint}`, config);
    const data: ApiResponse<T> = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  } catch (error) {
    return Promise.reject(String(error));
  }
}

async function getAuthInformation(): Promise<PersistentAuthInformation | null> {
  const stringifiedAuthInfo = window.localStorage.getItem(persistentKey);
  // let parsedTokenInfo: PersistentAuthInformation | null = null;
  if (stringifiedAuthInfo === null) return null;

  try {
    const parsedTokenInfo = JSON.parse(stringifiedAuthInfo);
    return parsedTokenInfo
  } catch (error) {
    // throw new Error('ParsingTokenInformationError');
    window.localStorage.removeItem(persistentKey);
    return null;
  }
}

function formatAuthResponseData(
  data: AuthInformation,
): PersistentAuthInformation {
  return {
    token: data.token,
    modules: data.modules,
    user: data.user,
    expiredAt: data.expireTime + Date.now(),
  };
}

async function handleAuthResponse(response: ApiResponse<AuthInformation>) {
  if (response.code === 0) {
    const formattedAuth = formatAuthResponseData(response.data);
    let stringifiedAuthInfo;
    try {
      stringifiedAuthInfo = JSON.stringify(formattedAuth);
      window.localStorage.setItem(persistentKey, stringifiedAuthInfo);
      return formattedAuth;
    } catch (error) {
      return Promise.reject('StringifyAuthError');
    }
  } else {
    return Promise.reject(response.mesg);
  }
}

// 获取验证码
async function getAuthCode() {
  const res = await client<string>('user/generateVerificationCode');
  if (res.code === 0) {
    return res.data;
  } else {
    return Promise.reject(res.mesg);
  }
}

// 验证验证码
async function verifyAuthCode(id: string, code: string) {
  const res = await client(
    `user/checkVerificationCode?id=${encodeURIComponent(
      id,
    )}&verificationCode=${encodeURIComponent(code)}`,
  );
  if (res.code === 0) {
    return res.data;
  } else {
    return Promise.reject(res.mesg);
  }
}

export interface LoginFormType {
  mail: string;
  password: string;
}

// 登录
async function login({ mail, password }: LoginFormType) {
  const res: ApiResponse<AuthInformation> = await client(
    `user/login?mail=${encodeURIComponent(mail)}&password=${password}`,
  );
  return handleAuthResponse(res);
}

export interface SignUpFormType {
  username: string;
  password: string;
}

// 注册
async function register({ username, password }: SignUpFormType) {
  const res: ApiResponse<AuthInformation> = await client('register', {
    username,
    password,
  });
  return handleAuthResponse(res);
}

// 刷新token
async function refreshToken() {
  const res: ApiResponse<AuthInformation> = await client('refresh-token');
  return handleAuthResponse(res);
}

// 登出
async function logout() {
  window.localStorage.removeItem(persistentKey);
}

export {
  getAuthInformation,
  login,
  register,
  logout,
  refreshToken,
  getAuthCode,
  verifyAuthCode,
};

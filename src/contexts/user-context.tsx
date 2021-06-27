import * as React from 'react';
import useInterval from 'use-interval';
import client from 'client';
import * as authProvider from 'auth-provider';
import { useAsync } from 'hooks/use-async';
import { FullPageError } from 'components/full-page-error';
import { FullPageLoading } from 'components/full-page-loading';
import { useToken } from 'hooks/use-token';

const UserContext = React.createContext<{
  authInfo: authProvider.PersistentAuthInformation | null;
  setAuthInfo: (data: authProvider.PersistentAuthInformation) => void;
}>(undefined!);
UserContext.displayName = 'UserContext';

// 页面发起的请求到达服务器的估计时间
const UNSAFE_REQUEST_TIME = 1000; // time unit: millisecond
// 在 token 过期之前的多少分钟的时候去刷新 token
const REFRESH_THRESH_HOLD = 4; // time unit: minutes
let refreshTokenRequest: Promise<any> | null = null;

function UserProvider({ children }: { children: React.ReactNode }) {
  const {
    data: authInfo,
    setData: setAuthInfo,
    run,
    isLoading,
    isIdle,
    isError,
    error,
    isSuccess,
  } = useAsync<authProvider.PersistentAuthInformation | null>();
  React.useEffect(() => {
    run(getAuthInfo());
  }, [run]);

  /**
   * 1.如果没有登录信息，不会定时去刷新 token
   * 2.如果有登录信息，但刷新的请求可能来不及到达服务器，也不会去刷新 token
   * 3.计算刷新 token 定时器的时间 = token过期时间 - 现在时间 - 刷新提前量，如果计算出来的定时器时间少于等于0，则马上刷新
   */
  const [refreshTokenInterval, immediate] = (function getUseIntervalParams(): [
    number | null,
    boolean,
  ] {
    if (!authInfo?.expiredAt) {
      return [null, false];
    } else if (Date.now() + UNSAFE_REQUEST_TIME >= authInfo.expiredAt) {
      return [null, false];
    } else {
      const interval =
        authInfo.expiredAt - Date.now() - 1000 * 60 * REFRESH_THRESH_HOLD;
      return [
        interval <= 0 ? authInfo.expiredAt - Date.now() : interval,
        interval <= 0 ? true : false,
      ];
    }
  })();

  // https://github.com/Hermanya/use-interval#readme
  useInterval(
    () => {
      refreshToken(setAuthInfo).finally(() => (refreshTokenRequest = null));
    },
    refreshTokenInterval,
    immediate,
  );

  if (isLoading || isIdle) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageError error={String(error)} />;
  }

  if (isSuccess) {
    return (
      <UserContext.Provider value={{ authInfo: authInfo ?? null, setAuthInfo }}>
        {children}
      </UserContext.Provider>
    );
  }

  return null;
}

function useClient() {
  const token = useToken();
  return React.useCallback(
    (endpoint, config) => {
      if (refreshTokenRequest) {
        refreshTokenRequest.then((user) =>
          client(endpoint, { ...config, token: user.token }),
        );
      } else {
        return client(endpoint, { ...config, token });
      }
    },
    [token],
  );
}
const getAuthInfo = async () => {
  const authInfo = await authProvider.getAuthInformation();
  if (authInfo) {
    const tokenNotExpiredYet =
      authInfo.expiredAt &&
      Date.now() + UNSAFE_REQUEST_TIME < authInfo.expiredAt;
    if (tokenNotExpiredYet) {
      return authInfo;
    }
  }
  return null;
};

// login 是高阶函数。它返回一个新函数处理用户登录的逻辑，如果登录成功，setUser将会把登录信息放入组件中，如果失败调用者会接收到抛出的错误
const login =
  (setAuthInfo: (data: authProvider.PersistentAuthInformation) => void) =>
    async ({
      authCodeId,
      authCode,
      formData,
    }: {
      authCodeId: string;
      authCode: string;
      formData: {
        mail: string;
        password: string;
      };
    }) => {
      await authProvider.verifyAuthCode(authCodeId, authCode);
      const authInfo = await authProvider.login(formData);
      setAuthInfo(authInfo);
    };

const refreshToken = async (
  setAuthInfo: (data: authProvider.PersistentAuthInformation) => void,
) => {
  refreshTokenRequest = authProvider.refreshToken();
  const authInfo = await refreshTokenRequest;
  setAuthInfo(authInfo);
  return authInfo;
};

const register =
  (setAuthInfo: (data: authProvider.PersistentAuthInformation) => void) =>
    async (form: authProvider.SignUpFormType) => {
      const authInfo = await authProvider.register(form);
      setAuthInfo(authInfo);
      return authInfo;
    };
const logout =
  (
    setAuthInfo: (data: authProvider.PersistentAuthInformation | null) => void,
  ) =>
    () => {
      setAuthInfo(null);
      authProvider.logout();
    };

export {
  UserProvider,
  login,
  register,
  logout,
  UserContext,
  refreshTokenRequest,
  useClient,
};

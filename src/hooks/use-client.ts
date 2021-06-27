import * as React from 'react';

import { useToken } from './use-token';
import client, { ClientConfig, ResponseType } from 'client';
import { refreshTokenRequest } from 'contexts/user-context';

// useClient 是 client 函数的 thin wrapper。唯一的功能就是在请求头中塞入token
function useClient() {
  const token = useToken();
  return React.useCallback(
    (endpoint: string, config?: ClientConfig, responseType?: ResponseType) => {
      if (refreshTokenRequest) {
        return refreshTokenRequest.then((user) =>
          client(
            endpoint,
            { ...config, token: user.token },
            responseType ?? 'json',
          ),
        );
      } else {
        return client(endpoint, { ...config, token }, responseType ?? 'json');
      }
    },
    [token],
  );
}

export { useClient };

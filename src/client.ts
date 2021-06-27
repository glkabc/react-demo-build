import * as authProvider from 'auth-provider';
import warning from 'warning';

const apiURL = process.env.REACT_APP_API_URL;

export interface JSONResponse<T> {
  code: 0 | 1 | 2;
  data: T;
  mesg: string;
}

export type ResponseType =
  | 'json'
  | 'blob'
  | 'arrayBuffer'
  | 'formData'
  | 'text';

export interface ClientConfig extends RequestInit {
  data?: any | FormData;
  token?: string;
  headers?: Record<string, string>;
}

interface RequestInitWithoutNullableHeaders extends RequestInit {
  headers: Record<string, string>;
}

async function client(
  endpoint: string,
  { data, token, headers: customHeaders, ...customConfig }: ClientConfig = {},
  responseType: ResponseType = 'json',
) {
  try {
    const isFormData = data instanceof FormData;
    let config: RequestInitWithoutNullableHeaders = {
      method: data ? 'POST' : 'GET',
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
      headers: {
        Authorization: token ?? '',
      },
      ...customConfig,
    };

    // 如果希望浏览器往请求头中自动添加合适的 Content-Type，
    // 则配置对象中不能包含 'Content-Type' 属性，即使值为 undefined，也会造成浏览器不能正常修改头部
    if (data && !isFormData) {
      config.headers['Content-Type'] = 'application/json';
    }
    config = { ...config, headers: { ...config.headers, ...customHeaders } };

    const removeAnyLeadingDashInPath = endpoint.replace(/^\/*/, '');
    const response = await fetch(
      `${apiURL}/${removeAnyLeadingDashInPath}`,
      config,
    );
    if (response.ok) {
      switch (responseType) {
        case 'json':
          return response.json();
        case 'blob':
          return response.blob();
        case 'arrayBuffer':
          return response.arrayBuffer();
        case 'formData':
          return response.formData();
        case 'text':
          return response.text();
        default:
          throw new Error('unsupported responseType' + responseType);
      }
    } else if (response.status === 401) {
      await authProvider.logout();
      window.location.assign(window.location.toString());
      return Promise.reject({ message: '新重新登录' });
    } else {
      return Promise.reject(response);
    }
  } catch (error) {
    warning(false, `Error occurred in client: ${error}`);
    throw error;
  }
}

export default client;

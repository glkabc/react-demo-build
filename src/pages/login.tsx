/** @jsxImportSource @emotion/react */
import * as React from 'react';
import { css } from '@emotion/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useAsync, useUpdateAuth } from 'hooks';
import { getAuthCode } from 'auth-provider';
import { login as userLogin } from 'contexts/user-context';

interface LoginForm {
  mail: string;
  password: string;
  authCode: string;
}

const authFormSchema = Yup.object().shape({
  mail: Yup.string().email('请输入正确格式的邮箱').required('请输入邮箱'),
  password: Yup.string()
    .trim()
    .min(6, '密码长度不能少于六位')
    .required('请输入密码'),
});

function Login() {
  const updateAuth = useUpdateAuth();
  const login = userLogin(updateAuth);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
  const isUnmounted = React.useRef(false);

  React.useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  const {
    data: authCodeData,
    isLoading: isAuthCodeLoading,
    isIdle: isAuthCodeIdle,
    isSuccess: isAuthCodeSuccess,
    isError: isAuthCodeError,
    run,
  } = useAsync<{ base64Str: string; id: string }>();

  const fetchAuthCode = React.useCallback(() => {
    // TODO clear authCode
    run(getAuthCode());
  }, [run]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(authFormSchema),
    defaultValues: {
      mail: '',
      password: '',
      authCode: '',
    },
  });

  React.useEffect(fetchAuthCode, [fetchAuthCode]);

  let renderAuthCode = null;
  if (isAuthCodeLoading || isAuthCodeIdle) {
    renderAuthCode = <span>验证码加载中...</span>;
  } else if (isAuthCodeError) {
    renderAuthCode = (
      <span onClick={fetchAuthCode}>验证码加载错误, 点击重新加载</span>
    );
  } else if (isAuthCodeSuccess && authCodeData) {
    renderAuthCode = (
      <img
        src={`data:image/png;base64,${authCodeData.base64Str}`}
        alt="登录验证码"
        css={{
          display: 'block',
          width: '65px',
        }}
        onClick={fetchAuthCode}
      />
    );
  }

  const onSubmit = async (formData: LoginForm) => {
    if (isAuthenticating) {
      return;
    } else {
      setIsAuthenticating(true);
      try {
        await login({
          authCodeId: authCodeData!.id,
          authCode: formData.authCode,
          formData,
        });
      } catch (error) {
        if (!isUnmounted.current) {
          alert(error);
        }
      } finally {
        if (!isUnmounted.current) {
          setIsAuthenticating(false);
        }
      }
    }
  };

  const commonYOffset = css({
    position: 'relative',
    top: -47,
  });

  const labelStyle = css({
    display: 'inline-block',
    width: 70,
  });

  const listItemStyle = css({
    marginBottom: 20,
    position: 'relative',
  });

  const errorStyle = css({
    color: 'crimson',
    fontSize: 12,
    position: 'absolute',
    left: 0,
    top: '100%',
  });

  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 css={[{ fontSize: 24, marginBottom: 16 }, commonYOffset]}>登录</h1>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        css={[
          {
            border: 'solid 1px #ccc',
            padding: '24px 8px 4px 8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          },
          commonYOffset,
        ]}
      >
        <ul css={{ listStyle: 'none' }}>
          <li css={listItemStyle}>
            <label htmlFor="mail" css={labelStyle}>
              Email:
            </label>
            <input type="text" id="mail" {...register('mail')} />
            {errors.mail ? <p css={errorStyle}>{errors.mail.message}</p> : null}
          </li>
          <li css={listItemStyle}>
            <label htmlFor="password" css={labelStyle}>
              Password:
            </label>
            <input type="password" id="password" {...register('password')} />
            {errors.password ? (
              <p css={errorStyle}>{errors.password.message}</p>
            ) : null}
          </li>
        </ul>
        <div css={{ display: 'flex', flexWrap: 'nowrap', marginBottom: 8 }}>
          {renderAuthCode}
          <Controller
            name="authCode"
            control={control}
            render={({ field }) => (
              <input
                css={{
                  marginLeft: 'auto',
                  padding: '0 8px',
                  fontWeight: 'bolder',
                }}
                {...field}
              />
            )}
          />
        </div>
        <input
          type="submit"
          value={isAuthenticating ? '登录中...' : '登录'}
          css={{
            marginBottom: 16,
            cursor: isAuthenticating ? 'not-allowed' : 'default',
          }}
        />
      </form>
    </div>
  );
}

export default Login;

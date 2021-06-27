import { rest } from 'msw';

const authURL = process.env.REACT_APP_AUTH_URL;
const apiURL = process.env.REACT_APP_API_URL;

const loginMock = [
  rest.get(`${authURL}/user/login`, (req, res, ctx) => {
    localStorage.setItem('is-authenticated', 'true');
    return res(
      ctx.status(200),
      ctx.json({
        code: 0,
        mesg: 'ok',
        data: {
          token: 'fake-token',
          user: {
            name: 'syvia',
            phone: '13329061556',
          },
          modules: [],
          expireTime: 1000 * 60 * 60,
        },
      }),
      ctx.delay(1000),
    );
  }),
  rest.get(`${apiURL}/user/generateVerificationCode`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 0,
        mesg: 'ok',
        data: { base64Str: 'string', id: 'string' },
      }),
    );
  }),
  rest.get(`${apiURL}/user/checkVerificationCode`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 0,
        mesg: 'ok',
        data: null,
      }),
    );
  }),
  rest.get(`${apiURL}/401`, (req, res, ctx) => {
    return res(ctx.status(401));
  }),
  rest.post(`${authURL}/refresh-token`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          name: 'sean',
          age: 30,
          token: 'fakeToken',
          expireTime: 1000 * 60 * 5,
        },
      }),
      ctx.delay(1000),
    );
  }),
]

export default loginMock
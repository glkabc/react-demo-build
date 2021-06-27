import { css } from '@emotion/react';
import { BiErrorAlt } from 'react-icons/bi';

const fullPageClass = css({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

type Props = {
  error: string;
};

const FullPageError = ({ error }: Props) => {
  return (
    <div css={fullPageClass}>
      <BiErrorAlt
        css={{
          width: '40px',
          height: '40px',
          color: 'red',
        }}
      />
      <p
        css={{
          color: '#444',
        }}
      >
        出错啦！您可以尝试刷新页面
      </p>
      <pre>{error}</pre>
    </div>
  );
};

export { FullPageError, fullPageClass };

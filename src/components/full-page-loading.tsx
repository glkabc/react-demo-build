import { keyframes } from '@emotion/react';
import { FaSpinner } from 'react-icons/fa';

import { fullPageClass } from './full-page-error';

const spinForever = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`;

function FullPageLoading() {
  return (
    <div css={fullPageClass}>
      <FaSpinner
        css={{
          width: 40,
          height: 40,
          color: '#333',
          animation: `${spinForever} 2s linear infinite`,
        }}
      />
    </div>
  );
}

export { FullPageLoading };

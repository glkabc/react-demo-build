import { Global, css } from '@emotion/react';

function StyleReset():JSX.Element {
  return (
    <Global
      styles={
        css`
        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: inherit;
        }

        html {
          box-sizing: border-box;
          font-size: 62.5%; /* 62.5% of 16px = 10px */
        }

        html,
        body,
        #root {
          height: 100%;
        }
        `
      }
    />
  )
}

export default StyleReset
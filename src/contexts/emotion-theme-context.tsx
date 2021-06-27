import * as React from 'react';
import { ThemeProvider as Provider } from '@emotion/react';
import { Theme as AugmentedTheme } from '@material-ui/core/styles';

import theme from 'styles/theme';

declare module '@emotion/react' {
  export interface Theme extends AugmentedTheme {}
}

function EmotionThemeProvider({ children }: { children?: React.ReactNode }) {
  return <Provider theme={theme}>{children}</Provider>;
}

export { EmotionThemeProvider };

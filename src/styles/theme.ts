import {
  createMuiTheme,
  Theme as AugmentedTheme,
} from '@material-ui/core/styles';

// Required to use type import, as a plain side-effect import will be emitted to runtime.
import type { } from '@material-ui/lab/themeAugmentation';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    dashboardDrawerWidth: number;
  }
  interface ThemeOptions {
    dashboardDrawerWidth?: number;
  }
}

const theme: AugmentedTheme = createMuiTheme({
  palette: {
    primary: { main: '#1ea5fc', light: '#e7fbf5', dark: '#1794e5' },
    secondary: { main: '#fd7240' },
    error: {
      main: '#fd5158',
      light: '#fdf2f1',
    },
    grey: {
      300: '#e2e2e2',
      A200: '#999',
      A400: '#333',
      A700: '#666',
    },
    background: {
      default: '#f0f6ff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 12,
    htmlFontSize: 10,
  },
  dashboardDrawerWidth: 240,
});

export default theme;

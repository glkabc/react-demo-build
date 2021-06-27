import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'styles/theme';

interface IThemeProviderProps {
  children: React.ReactNode
}

function MUIThemeProvider({ children }: IThemeProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export { MUIThemeProvider };

import { StylesProvider } from '@material-ui/core/styles';

interface IStylesProvider {
  children: React.ReactNode
}

function MUIStylesProvider({ children }: IStylesProvider) {
  return <StylesProvider injectFirst>{children}</StylesProvider>;
}

export { MUIStylesProvider };

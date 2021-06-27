import { ReactQueryProvider } from './react-query-provider';
import { BrowserRouter as Router } from 'react-router-dom';
import { MUIStylesProvider } from './mui-styles-context';
import { MUIThemeProvider } from './mui-theme-context';
import { EmotionThemeProvider } from './emotion-theme-context';
import { SnackbarProvider } from './snackbar-provider';
import { UserProvider } from './user-context';

interface IAppProviderProps {
  children?: React.ReactNode
}

function AppProvider({ children }:IAppProviderProps) {
  return (
    <ReactQueryProvider>
      <Router>
        <MUIStylesProvider>
          <SnackbarProvider>
            <UserProvider>
              <MUIThemeProvider>
                <EmotionThemeProvider>
                  { children }
                </EmotionThemeProvider>
              </MUIThemeProvider>
            </UserProvider>
          </SnackbarProvider>
        </MUIStylesProvider>
      </Router>
    </ReactQueryProvider>
  )

}

export default AppProvider
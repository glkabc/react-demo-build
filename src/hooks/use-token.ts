import * as React from 'react';
import { UserContext } from 'contexts/user-context';

function useToken() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useToken must be used within a UserProvider');
  }
  return context.authInfo?.token;
}

export { useToken };

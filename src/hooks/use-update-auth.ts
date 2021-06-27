import * as React from 'react';
import { UserContext } from 'contexts/user-context';

function useUpdateAuth() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUpdateAuth must be used within a UserProvider');
  }
  return context.setAuthInfo;
}

export { useUpdateAuth };

import React from 'react';
import { FullPageLoading } from 'components';
import { useToken } from 'hooks';

const AuthenticatedApp = React.lazy(
  () => import(/* webpackPrefetch: true */ './authenticated-app'),
);

const UnAuthenticatedApp = React.lazy(
  () => import(/* webpackPrefetch: true */ './unauthenticated-app'),
);


function App() {
  const token = useToken();
  return (
    <React.Suspense fallback={<FullPageLoading />}>
      {token ? <AuthenticatedApp /> : <UnAuthenticatedApp />}
    </React.Suspense>
  );
}

export default App;

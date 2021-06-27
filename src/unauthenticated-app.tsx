import { Route, Switch } from 'react-router-dom';

import Login from 'pages/login';

function UnauthenticatedApp() {
  return (
    <Switch>
      <Route path="/">
        <Login />
      </Route>
    </Switch>
  );
}

export default UnauthenticatedApp;

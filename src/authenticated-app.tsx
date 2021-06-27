/** @jsxImportSource @emotion/react */
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from 'pages/dashboard';
import NoMatchDashboard from './pages/dashboard/no-match-dashboard';
const Home = React.lazy(() => import(/*webpackPrefetch:true */ 'pages/home'));

// const DirectoryBinding = React.lazy(() => /*webpackPrefetch:true*/ 'pages/')

function AuthenticatedApp() {
  return (
    <Dashboard>
      <React.Suspense fallback={<div>页面加载中...</div>}>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path='*'>
            <NoMatchDashboard />
          </Route>
        </Switch>
      </React.Suspense>
    </Dashboard>
  );
}

export default AuthenticatedApp;

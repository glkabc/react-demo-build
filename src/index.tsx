import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { CssBaseline } from '@material-ui/core';
import { enableAllPlugins } from 'immer';

import App from './App';
import StyleReset from 'styles/style-reset';
import AppProvider from 'contexts';
import 'mocks';

enableAllPlugins();

ReactDOM.render(
  <React.StrictMode>
    <StyleReset />
    <CssBaseline />
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

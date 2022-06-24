import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global } from '@emotion/react';
import App from './App';
import globalStyles from './globalStyles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <App />
  </React.StrictMode>
);

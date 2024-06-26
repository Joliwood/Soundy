import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';

import { store } from './redux';
import App from './App';
import { appoloClient } from './helpers';
import './index.css';
import './i18n';
import { ToastProvider } from './components';
import ScrollToTop from './components/ScrollToTop';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={appoloClient}>
      <CookiesProvider>
        <Provider store={store}>
          <BrowserRouter>
            <ToastProvider>
              <ScrollToTop />
              <App />
            </ToastProvider>
          </BrowserRouter>
        </Provider>
      </CookiesProvider>
    </ApolloProvider>
  </React.StrictMode>,
);

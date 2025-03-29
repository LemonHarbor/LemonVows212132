import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './utils/i18n';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppProvider>
  </React.StrictMode>,
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/improved-styles.css';
import './utils/i18n';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);

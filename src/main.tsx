import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './utils/i18n';
import './styles/improved-styles.css';

// Use the correct type assertion for container
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

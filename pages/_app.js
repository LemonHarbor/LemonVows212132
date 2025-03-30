// pages/_app.js
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyle';
import { theme } from '../styles/theme';
import DevModePanel from '../components/common/DevModePanel';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
      <DevModePanel />
    </ThemeProvider>
  );
}

export default MyApp;

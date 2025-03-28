import '../../styles/demo.css';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

function DemoApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(DemoApp);

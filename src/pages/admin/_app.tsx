import '../../styles/admin-page.css';
import '../../styles/admin.css';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

function AdminApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(AdminApp);

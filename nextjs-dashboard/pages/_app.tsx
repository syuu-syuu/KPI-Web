import { AppProps } from 'next/app';

import '@/styles/global.css';

function Dashboard({ Component, pageProps }: AppProps) {
  return (
      <Component {...pageProps} />
  );
}

export default Dashboard;
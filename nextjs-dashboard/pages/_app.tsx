import { AppProps } from 'next/app';
import { SiteProvider } from '@/contexts/SiteContext';
import '@/styles/global.css';

function Dashboard({ Component, pageProps }: AppProps) {
  return (
    <SiteProvider siteMenuItems={pageProps.siteMenuItems}>
        <Component {...pageProps} />
    </SiteProvider>
  );
}

export default Dashboard;
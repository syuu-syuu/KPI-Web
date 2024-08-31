import { NextComponentType, NextPageContext } from 'next';
import { AppProps } from 'next/app';
import Layout from '@/components/Layout';

import '@/styles/global.css';

type MyAppProps = AppProps & {
  Component: NextComponentType<NextPageContext> & { noLayout?: boolean };
};

function Dashboard({ Component, pageProps }: MyAppProps) {
  const noLayout = Component.noLayout || false;

  return (
    <>
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}

export default Dashboard;
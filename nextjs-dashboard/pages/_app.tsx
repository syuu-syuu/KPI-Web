import { NextComponentType, NextPageContext } from 'next';
import { AppProps } from 'next/app';
import Layout from '@/components/layout';
import DashboardLayout from '@/components/dashboard-layout';
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
        // <Layout>
        //   <Component {...pageProps} />
        // </Layout>
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      )}
    </>
  );
}

export default Dashboard;
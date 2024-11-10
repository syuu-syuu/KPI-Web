import '@/styles/global.css';
import { NextComponentType, NextPageContext } from 'next';
import { AppProps } from 'next/app';
import { SiteProvider } from '@/hooks/use-nav';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/side-nav/app-sidebar"

type MyAppProps = AppProps & {
  Component: NextComponentType<NextPageContext> & { noLayout?: boolean };
};

const Dashboard = ({ Component, pageProps }: MyAppProps) => {
  const noLayout = Component.noLayout || false;
  return (
    <>
      {noLayout ? (
        <Component {...pageProps}/>
      ) : (
        <SiteProvider>
          <SidebarProvider variant="inset">
            <AppSidebar variant="inset"/>
              <Component {...pageProps}/>
          </SidebarProvider>
        </SiteProvider>
      )}
    </>
  );
}

export default Dashboard;
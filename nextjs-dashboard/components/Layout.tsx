import SideNav from '@/components/SideNav';
import { SiteProvider } from '@/contexts/SiteContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <SiteProvider>
        <div className="flex h-screen flex-row md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-1/3">
            <SideNav />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
      </SiteProvider>
    );
};

export default Layout;
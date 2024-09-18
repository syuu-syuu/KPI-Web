import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SiteProvider } from '@/hooks/use-nav';


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteProvider>
      <SidebarLayout defaultOpen={true}>
        <AppSidebar />
        <main className="flex flex-1 flex-col p-6 transition-all duration-300 ease-in-out bg-white">
            <SidebarTrigger />
            <div className="h-full w-full rounded-md mt-5 border-2 border-dashed p-8">
                {children}
            </div>
        </main>
      </SidebarLayout>
    </SiteProvider>
  );
}

export default DashboardLayout;
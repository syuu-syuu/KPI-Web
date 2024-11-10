import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface SitePageLayoutProps {
  siteName?: string;
  pageTitle: string;
  children: React.ReactNode;
}

export function SitePageLayout({ siteName, pageTitle, children }: SitePageLayoutProps) {
  return (
    <SidebarInset>
      {/* Fixed header */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  {pageTitle}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{siteName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {children}
        </div>
      </div>
    </SidebarInset>
  )
}
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { fetchSiteDetails } from '@/lib/api'
import { SiteDetail } from '@/lib/definitions'
import SiteDetailsForm from '@/components/site-details-form'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"


const SitePage = () => {
  const router = useRouter()
  const site_id = router.query.site_id as string;
  const [files, setFiles] = useState<File[]>([]);
  const [SiteDetails, setSiteDetails] = useState<SiteDetail>();
  console.log("router.isReady:", router.isReady);
  console.log(site_id); 

  useEffect(() => {
    if (router.isReady) {
      const loadSiteDetails = async () => {
        const data = await fetchSiteDetails(site_id); 
        console.log('Site Details:', data);
        setSiteDetails(data); 
      };

      loadSiteDetails();

    }
  
}, [site_id]);

  const updateSiteDetails = (updatedDetails: SiteDetail) => {
      setSiteDetails(updatedDetails);
    };


  return (
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                  Site Profile
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{SiteDetails?.site_name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
       
        <div className='p-4'> <SiteDetailsForm site_id={site_id} siteDetails={SiteDetails} onUpdateSiteDetails={updateSiteDetails}/>
     
     </div>
     

    </SidebarInset> 
  );
}

export default SitePage;

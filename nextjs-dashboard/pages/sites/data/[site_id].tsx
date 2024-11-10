"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'
// Import FilePond styles
import 'filepond/dist/filepond.min.css'
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { FilePondFile } from 'filepond'
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

import { fetchSiteDetails, fetchOriginalRawData} from '@/lib/api'
import { SiteDetail } from '@/lib/definitions'
import SiteDetailsForm from '@/components/site-details-form'
import DataTable from '@/components/raw-data-table/data-table'
import { SiteHourlyDataSample } from '@/components/raw-data-table/data'
import { ExclusiveOutageDataTable } from '@/components/exclusive-outages-table/data-table'
import { exclusiveOutageDataSample } from '@/components/exclusive-outages-table/data'
import {columns} from '@/components/exclusive-outages-table/columns'
import { AppSidebar } from "@/components/side-nav/app-sidebar"
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
  SidebarProvider,
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
  

      //  <SidebarInset>
      //   <header className="flex h-16 shrink-0 items-center gap-2">
      //     <div className="flex items-center gap-2 px-4">
      //       <SidebarTrigger className="-ml-1" />
      //       <Separator orientation="vertical" className="mr-2 h-4" />
      //       <Breadcrumb>
      //         <BreadcrumbList>
      //           <BreadcrumbItem className="hidden md:block">
      //             <BreadcrumbLink href="#">
      //               Building Your Application
      //             </BreadcrumbLink>
      //           </BreadcrumbItem>
      //           <BreadcrumbSeparator className="hidden md:block" />
      //           <BreadcrumbItem>
      //             <BreadcrumbPage>Data Fetching</BreadcrumbPage>
      //           </BreadcrumbItem>
      //         </BreadcrumbList>
      //       </Breadcrumb>
      //     </div>
      //   </header>
      //   <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      //     <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      //       <div className="aspect-video rounded-xl bg-muted/50" />
      //       <div className="aspect-video rounded-xl bg-muted/50" />
      //       <div className="aspect-video rounded-xl bg-muted/50" />
      //     </div>
      //     <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      //   </div>
      // </SidebarInset>

    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                  Site Data
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

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
     
     <div className="flex flex-col p-4" >
       <div className="flex items-center space-x-4 mt-6">
        <div className="flex-1">
          <FilePond
            files={files}
            onupdatefiles={(fileItems: FilePondFile[]) => {setFiles(fileItems.map((fileItem) => fileItem.file as File))}}
            allowMultiple={false}
            server={
              {
                process: {
                url: '/api/upload_file',
                method: 'POST',
                withCredentials: false,
                headers: {},
                onload: (response) => response.key, // Handle the server response
                onerror: (response) => response.data,
                ondata: (formData) => {
                  formData.append('site_id', site_id); // Append site_id to form data
                  Array.from(formData.entries()).forEach(([key, value]) => {
                      console.log(`${key}:`, value);
                  });
                  return formData;
                },
              },
              }
            }
            name="files" 
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            instantUpload={false}
          />
        </div>
      </div> 

      <DataTable data={SiteHourlyDataSample} site_id={site_id}/>
      <div className='mt-6'>
        <ExclusiveOutageDataTable data={exclusiveOutageDataSample} columns={columns}/>
      </div> 
    </div>
    </SidebarInset> 
  );
}

export default SitePage;
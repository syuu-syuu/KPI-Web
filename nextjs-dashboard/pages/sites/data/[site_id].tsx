"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { SitePageLayout } from '@/components/site-page-layout'

import { fetchSiteDetails } from '@/lib/api'
import { SiteDetail } from '@/lib/definitions'
import DataTable from '@/components/raw-data-table/data-table'
import { SiteHourlyDataSample } from '@/components/raw-data-table/data'
import { ExclusiveOutageDataTable } from '@/components/exclusive-outages-table/data-table'
import { exclusiveOutageDataSample } from '@/components/exclusive-outages-table/data'
import {columns} from '@/components/exclusive-outages-table/columns'
import { DataProcessingPanel } from '@/components/data-processing/processing-panel'

const SitePage = () => {
  const router = useRouter()
  const site_id = router.query.site_id as string;
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

  return (
    <SitePageLayout
      siteName={SiteDetails?.site_name}
      pageTitle="Site Data"
    >
        <div className="flex flex-col gap-6 p-4" >
          <DataProcessingPanel site_id={site_id} />
          <DataTable data={SiteHourlyDataSample} site_id={site_id}/>
          <ExclusiveOutageDataTable data={exclusiveOutageDataSample} columns={columns}/>
        </div>
    </SitePageLayout>
  );
}

export default SitePage;
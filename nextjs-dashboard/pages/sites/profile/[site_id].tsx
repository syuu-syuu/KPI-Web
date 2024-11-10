"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SitePageLayout } from '@/components/site-page-layout'
import { fetchSiteDetails } from '@/lib/api'
import { SiteDetail } from '@/lib/definitions'
import SiteDetailsForm from '@/components/site-details-form'

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
     <SitePageLayout
      siteName={SiteDetails?.site_name}
      pageTitle="Site Profile"
    >
      {/* Your profile page specific content */}
      <div className="grid gap-4">
        <SiteDetailsForm 
          site_id={site_id}
          siteDetails={SiteDetails} 
          onUpdateSiteDetails={updateSiteDetails}
        />
        {/* Other profile components */}
      </div>
    </SitePageLayout>
  );
}

export default SitePage;

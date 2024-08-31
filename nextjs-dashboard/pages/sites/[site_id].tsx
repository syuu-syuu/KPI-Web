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
import Layout from '@/components/Layout'
import { fetchSiteDetails } from '@/lib/api'
import { SiteDetail } from '@/lib/definitions'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

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

  const formFields = [
    { label: 'Site Name', value: SiteDetails?.site_name },
    { label: 'Address', value: SiteDetails?.address },
    { label: 'City', value: SiteDetails?.city },
    { label: 'State', value: SiteDetails?.state },
    { label: 'Latitude', value: SiteDetails?.latitude },
    { label: 'Longitude', value: SiteDetails?.longitude },
    { label: 'Contract Start Month', value: SiteDetails?.contract_start_month },
    { label: 'Contract End Month', value: SiteDetails?.contract_end_month },
  ];

  return (
    <Layout>
      <h1> {SiteDetails?.site_name} </h1> 
      <form>
        {formFields.map((field, index) => (
          <div key={index}>
            <label>{field.label}:</label>
            <input type="text" value={field.value} readOnly />
          </div>
        ))}
      </form>
      <FilePond
        files={files}
        onupdatefiles={(fileItems: FilePondFile[]) => {setFiles(fileItems.map((fileItem) => fileItem.file as File))}}
        allowMultiple={false}
        server="/api/upload_file"
        name="files" /* sets the file input name, it's filepond by default */
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />  
    </Layout>
  );
}

export default SitePage;
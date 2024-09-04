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
import { fetchSiteDetails } from '@/lib/api'
import { SiteDetail } from '@/lib/definitions'
// import { MonthPicker, MonthInput } from 'react-lite-month-picker';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const SitePage = () => {
  const router = useRouter()
  const site_id = router.query.site_id as string;
  const [files, setFiles] = useState<File[]>([]);
  const [SiteDetails, setSiteDetails] = useState<SiteDetail>();
  const [selectedMonthData, setSelectedMonthData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  // const [isPickerOpen, setIsPickerOpen] = useState(false);
  // const [isFileUploadEnabled, setIsFileUploadEnabled] = useState(false);
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

//  useEffect(() => {
//     if (selectedMonthData.month && selectedMonthData.year) {
//       setIsFileUploadEnabled(true);
//     } else {
//       setIsFileUploadEnabled(false);
//     }
//   }, [selectedMonthData]);

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
    <>
      <h1> {SiteDetails?.site_name} </h1> 
      <form>
        {formFields.map((field, index) => (
          <div key={index}>
            <label>{field.label}:</label>
            <input type="text" value={field.value} readOnly />
          </div>
        ))}
      </form>
         <div className="flex items-center space-x-4 mt-6">
        {/* <div>
          <MonthInput
            selected={selectedMonthData}
            setShowMonthPicker={setIsPickerOpen}
            showMonthPicker={isPickerOpen}
            className="border rounded py-2 px-3 text-gray-700"
          />
          {isPickerOpen ? (
            <MonthPicker
              setIsOpen={setIsPickerOpen}
              selected={selectedMonthData}
              onChange={setSelectedMonthData}
            />
          ) : null}
        </div> */}

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
            name="files" /* sets the file input name, it's filepond by default */
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            instantUpload={false}
            // disabled={!isFileUploadEnabled}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}

export default SitePage;
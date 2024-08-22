// 'use client'
// import { usePathname } from 'next/navigation';

// const SitePage = () => {
//   const pathname = usePathname(); 
//   const parts = pathname.split('/');  // Split the pathname by '/' to extract parts
//   const siteName = parts[parts.length - 1];  // Assuming the site name is the last part of the path

//   return (
//     <div>
//       <h1>Site: {siteName}</h1>
//     </div>
//   );
// };

// export default SitePage;


// import MapForm from '@/app/ui/map-form';

//  export default function SitePage ({params} : {params: {siteName: string}}) {

//   return (
//     <div>
//       <h1>Site for {params.siteName}</h1>
//       <MapForm />  
//     </div>
//   );
//  }

"use client"
import Dropzone from 'react-dropzone'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
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

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
export default function SitePage ({params} : {params: {siteName: string}}) {
  const [files, setFiles] = useState([])
  return (
    <div>
      <h1>Site for {params.siteName}</h1>
      {/* <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
        {({getRootProps, getInputProps}) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone> */}

   
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        server="/api/upload_file"
        // server="http://127.0.0.1:8000/api/upload_file"
        name="files" /* sets the file input name, it's filepond by default */
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
  
    </div>
  );
}
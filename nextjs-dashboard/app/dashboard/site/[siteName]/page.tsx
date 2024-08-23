"use client"
import React, { useState } from 'react'
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
export default function SitePage ({params} : {params: {siteName: string}}) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div>
      <h1>Site for {params.siteName}</h1> 
      <FilePond
        files={files}
        onupdatefiles={(fileItems: FilePondFile[]) => {setFiles(fileItems.map((fileItem) => fileItem.file as File))}}
        allowMultiple={false}
        server="/api/upload_file"
        // server="http://127.0.0.1:8000/api/upload_file"
        name="files" /* sets the file input name, it's filepond by default */
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />  
    </div>
  );
}
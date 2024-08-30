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
import Layout from '@/components/Layout'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const SitePage = ({ site_id }: { site_id: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Layout>
      <h1>Site for {site_id}</h1> 
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
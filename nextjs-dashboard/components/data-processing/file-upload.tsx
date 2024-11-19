import { useToast } from '@/hooks/use-toast';

import { FilePond, registerPlugin } from 'react-filepond'; // Import React FilePond
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePondFile } from 'filepond';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview); // Register the plugins

interface FileUploadProps {
  site_id: string;
  onStatusChange: (
    status: 'idle' | 'uploading' | 'completed' | 'error',
  ) => void;
}

export function FileUpload({ site_id, onStatusChange }: FileUploadProps) {
  const { toast } = useToast();

  return (
    <FilePond
      allowMultiple={true}
      server={{
        process: {
          url: '/api/upload_file',
          method: 'POST',
          withCredentials: false,
          headers: {},
          onload: (response) => {
            onStatusChange('completed');
            toast({
              title: 'Success',
              description: 'File uploaded successfully',
            });
            return response.key; // Handle the server response
          },
          onerror: (response) => {
            onStatusChange('error');
            toast({
              title: 'Error',
              description: 'Failed to upload file',
              variant: 'destructive',
            });
            return response.data;
          },
          ondata: (formData) => {
            formData.append('site_id', site_id); // Append site_id to form data
            onStatusChange('uploading');
            return formData;
          },
        },
      }}
      name="files"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      instantUpload={false}
      className="mb-4"
    />
  );
}

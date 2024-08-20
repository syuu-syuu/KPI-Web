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


import MapForm from '@/app/ui/map-form';

 export default function SitePage ({params} : {params: {siteName: string}}) {

  return (
    <div>
      <h1>Site for {params.siteName}</h1>
      <MapForm />  {/* Pass siteName if needed */}
    </div>
  );
 }
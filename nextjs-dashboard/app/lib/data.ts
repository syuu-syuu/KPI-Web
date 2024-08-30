import { SiteDetail } from '@/app/lib/definitions';

export const fetchSites = async (): Promise<SiteDetail[]> => {
  try {
    const response = await fetch('/api/sites/'); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
};

// import { GetServerSideProps } from 'next';
// import { SiteDetail } from '@/app/lib/definitions';

// const fetchSites: GetServerSideProps = async () => {
//   try {
//     const response = await fetch('/api/sites'); 
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data: SiteDetail[] = await response.json();
//     return {
//       props: {
//         sites: data,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching sites:', error);
//     throw error;
//   }
// }

// export {fetchSites};
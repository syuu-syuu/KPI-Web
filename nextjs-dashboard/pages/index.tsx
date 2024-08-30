import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { fetchSites } from '@/lib/api';
import '@/styles/global.css';

export const getServerSideProps: GetServerSideProps = async () => {
  const siteMenuItems = await fetchSites(); // Fetch the data server-side
  return {
    props: {
      siteMenuItems, // Pass the data to the page component, which will be passed down to Layout
    },
  };
};

const Dashboard = () => {
  return (
    <Layout>
      <h1>HomePage</h1>
    </Layout>
  );
}

export default Dashboard;
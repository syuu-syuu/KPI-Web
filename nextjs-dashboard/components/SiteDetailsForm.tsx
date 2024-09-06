import React from 'react';
import { SiteDetail } from '@/lib/definitions';

interface SiteDetailsFormProps {
  siteDetails: SiteDetail | undefined;
}

const SiteDetailsForm: React.FC<SiteDetailsFormProps> = ({ siteDetails }) => {
  const formFields = [
    { label: 'Site Name', value: siteDetails?.site_name },
    { label: 'Address', value: siteDetails?.address },
    { label: 'City', value: siteDetails?.city },
    { label: 'State', value: siteDetails?.state },
    { label: 'Latitude', value: siteDetails?.latitude },
    { label: 'Longitude', value: siteDetails?.longitude },
    { label: 'Contract Start Month', value: siteDetails?.contract_start_month },
    { label: 'Contract End Month', value: siteDetails?.contract_end_month },
  ];

  return (
    <form>
      {formFields.map((field, index) => (
        <div key={index}>
          <label>{field.label}:</label>
          <input type="text" value={field.value || ''} readOnly />
        </div>
      ))}
    </form>
  );
};

export default SiteDetailsForm;

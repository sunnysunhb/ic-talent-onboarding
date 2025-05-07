import React from 'react';
import './Customers.css';
import GenericCrudPage from '../components/common/GenericCrudPage';
import useCustomersConfig from './customersConfig';

const Customers = React.memo(() => {
  const config = useCustomersConfig();
  return (
    <div className="customers-container">
      <GenericCrudPage {...config} />
    </div>
  );
});

export default Customers;

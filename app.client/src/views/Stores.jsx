import React from 'react';
import '../styles/shared-styles.css';
import './Stores.css';
import GenericCrudPage from '../components/common/GenericCrudPage';
import useStoresConfig from './storesConfig.jsx';

const Stores = React.memo(() => {
  const storesConfig = useStoresConfig();
  return (
    <div className={storesConfig.containerClassName || 'stores-container'}>
      <GenericCrudPage {...storesConfig} />
    </div>
  );
});

export default Stores;

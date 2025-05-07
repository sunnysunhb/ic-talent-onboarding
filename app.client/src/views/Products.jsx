import React from 'react';
import './Products.css';
import GenericCrudPage from '../components/common/GenericCrudPage';
import useProductsConfig from './productsConfig.jsx';

const Products = React.memo(() => {
  const productsConfig = useProductsConfig();
  return (
    <div className="products-container">
      <GenericCrudPage {...productsConfig} />
    </div>
  );
});

export default Products;

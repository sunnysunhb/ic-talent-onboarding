const API_PORT = import.meta.env.VITE_API_PORT || '5173';
const API_BASE = import.meta.env.DEV 
  ? `http://localhost:${API_PORT}/api`
  : '/api';

console.log('API base URL:', API_BASE);

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE}/Product`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
      });
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error(`Network error: ${error.message}`);
  }
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_BASE}/Product/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return await response.json();
};

export const createProduct = async (product) => {
  const response = await fetch(`${API_BASE}/Product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return await response.json();
};

/**
 * Update product information API
 * @param {string} id - Product ID
 * @param {object} product - Product object
 * @param {string} product.Name - Product name
 * @param {number} product.Price - Product price
 * @param {string} [product.Description] - Product description (optional)
 * @returns {Promise} Returns updated product data
 * Data flow: productsConfig -> productApi -> backend API
 */
export const updateProduct = async (id, product) => {
  // Construct request URL
  const url = `${API_BASE}/Product/${id}`;
  
  // Prepare request data
  const requestData = {
    Id: id,               // Must include product ID
    Name: product.Name,   // Product name
    Price: product.Price, // Product price
    Description: product.Description // Product description (optional)
  };

  // Send PUT request
  console.log('Making API request to:', url, 'with data:', requestData); // Debug log
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE}/Product/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};

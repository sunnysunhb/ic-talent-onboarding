// Define API base configuration
const API_PORT = import.meta.env.VITE_API_PORT || '5158'; // Get port from env vars, default 5158
const API_BASE = import.meta.env.DEV  // Determine API base path based on environment
  ? `http://localhost:${API_PORT}/api`  // Use local address in development
  : '/api';  // Use relative path in production

/**
 * Get all sales records
 * @returns {Promise<Array>} Array of sales records
 * @throws {Error} Throws error when request fails
 */
export const getSales = async () => {
  const response = await fetch(`${API_BASE}/Sale`, {
    headers: {
      'Cache-Control': 'no-cache' // Disable cache to ensure fresh data
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch sales'); // Throw error on request failure
  }
  const data = await response.json();
  console.log('Sales API response:', data); // Log API response data
  return data;
};

/**
 * Get single sales record
 * @param {number|string} id Sales record ID 
 * @returns {Promise<Object>} Sales record object
 * @throws {Error} Throws error when request fails
 */
export const getSale = async (id) => {
  const response = await fetch(`${API_BASE}/Sale/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sale');
  }
  return await response.json();
};

/**
 * Create new sales record
 * @param {Object} sale Sales record object
 * @param {number|string} sale.customerId Customer ID
 * @param {number|string} sale.productId Product ID 
 * @param {number|string} sale.storeId Store ID
 * @param {string} sale.dateSold Date sold
 * @returns {Promise<Object>} Newly created sales record
 * @throws {Error} Throws error when request fails
 */
export const createSale = async (saleDto) => {
  // Prepare request data, convert types to ensure API compatibility
  const requestData = {
    Id: saleDto.Id || 0,
    CustomerId: parseInt(saleDto.CustomerId),
    ProductId: parseInt(saleDto.ProductId),
    StoreId: parseInt(saleDto.StoreId),
    CustomerName: saleDto.CustomerName || '',
    ProductName: saleDto.ProductName || '',
    StoreName: saleDto.StoreName || '',
    DateSold: saleDto.DateSold || new Date().toISOString().split('T')[0]
  };

  console.log('Creating sale with data:', requestData); // Log request data
  // Send POST request to create sales record
  const response = await fetch(`${API_BASE}/Sale`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Set JSON content type
    },
    body: JSON.stringify(requestData), // Serialize request body
  });
  
  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Failed to create sale:', errorResponse); // Log error details
    throw new Error(errorResponse.title || 'Failed to create sale'); // Throw error
  }
  return await response.json(); // Return created sales record
};

/**
 * Update sales record
 * @param {number|string} id Sales record ID to update
 * @param {Object} sale Updated sales record data
 * @returns {Promise<Object>} Updated sales record
 * @throws {Error} Throws error when validation or request fails
 */
export const updateSale = async (id, saleDto) => {
  // Validate required fields
  if (!saleDto.CustomerId || !saleDto.ProductId || !saleDto.StoreId) {
    throw new Error('Please select valid Customer, Product and Store');
  }

  // Validate URL ID matches request body ID
  if (parseInt(id) !== parseInt(saleDto.Id)) {
    throw new Error('URL ID does not match request body ID');
  }

  // Prepare request data
  const requestData = {
    Id: parseInt(id),
    CustomerId: parseInt(saleDto.CustomerId),
    ProductId: parseInt(saleDto.ProductId),
    StoreId: parseInt(saleDto.StoreId),
    CustomerName: saleDto.CustomerName || '',
    ProductName: saleDto.ProductName || '',
    StoreName: saleDto.StoreName || '',
    DateSold: saleDto.DateSold || new Date().toISOString().split('T')[0]
  };

  // Validate IDs are valid numbers
  if (isNaN(requestData.CustomerId)) {
    throw new Error('CustomerId must be a valid number');
  }
  if (isNaN(requestData.ProductId)) {
    throw new Error('ProductId must be a valid number');
  }
  if (isNaN(requestData.StoreId)) {
    throw new Error('StoreId must be a valid number');
  }

  // Log debug information
  console.log('Updating sale with raw data:', saleDto);
  console.log('Updating sale with processed data:', requestData);
  // Send PUT request to update sales record
  const response = await fetch(`${API_BASE}/Sale/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });


  if (!response.ok) {
    let errorResponse;
    try {
      errorResponse = await response.json();
    } catch (e) {
      errorResponse = { title: response.statusText };
    }
    
    // Group and log detailed error information
    console.group('Failed to update sale - Full error details');
    console.error('Status:', response.status);
    console.error('Status Text:', response.statusText); 
    console.error('Error Response:', errorResponse);
    console.groupEnd();
    
    // Construct detailed error message
    const errorDetails = errorResponse.errors 
      ? Object.entries(errorResponse.errors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('\n')
      : errorResponse.title || 'Validation failed';
    
    throw new Error(
      `Update failed: ${errorDetails}`,
      { cause: errorResponse } // Preserve original error information
    );
  }

  // Handle 204 No Content response
  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch (e) {
    console.warn('No JSON response from server, returning null');
    return null;
  }
};

/**
 * Delete sales record
 * @param {number|string} id Sales record ID to delete 
 * @throws {Error} Throws error when request fails
 */
export const deleteSale = async (id) => {
  const response = await fetch(`${API_BASE}/Sale/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete sale');
  }
};

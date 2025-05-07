const API_PORT = import.meta.env.VITE_API_PORT || '5177';
const API_BASE = import.meta.env.DEV 
  ? `http://localhost:${API_PORT}/api`
  : '/api';

// Add API health check
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status}`);
    }
    
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Invalid JSON:', text);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('API Health Check Error:', error);
    throw new Error(`API is not available: ${error.message}`);
  }
};

export const getCustomers = async () => {
  try {
    console.log('Fetching customers from API:', `${API_BASE}/Customer`);
    const response = await fetch(`${API_BASE}/Customer`, {
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
      throw new Error(`Failed to fetch customers: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Received customers data:', data);
    return data;
  } catch (error) {
    console.error('Fetch Error:', {
      message: error.message,
      stack: error.stack,
      apiUrl: `${API_BASE}/Customer`
    });
    throw new Error(`Network error: ${error.message}`);
  }
};

export const getCustomer = async (id) => {
  const response = await fetch(`${API_BASE}/Customer/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch customer');
  }
  return await response.json();
};

export const createCustomer = async (customer) => {
  const response = await fetch(`${API_BASE}/Customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    throw new Error('Failed to create customer');
  }
  return await response.json();
};

export const updateCustomer = async (id, customer) => {
  try {
    // Ensure the data includes Id
    const updateData = {
      Id: id,
      Name: customer.Name,
      Address: customer.Address
    };
    
    console.log('Updating customer:', { id, updateData });
    const response = await fetch(`${API_BASE}/Customer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Update Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        body: text,
        sentData: updateData
      });
      throw new Error(`Failed to update customer: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Update successful:', data);
    return data;
  } catch (error) {
    console.error('Update Error:', {
      message: error.message,
      stack: error.stack,
      apiUrl: `${API_BASE}/Customer/${id}`,
      customer
    });
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    console.log('Deleting customer:', { id });
    const response = await fetch(`${API_BASE}/Customer/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Delete Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
      });

      // Try to parse error message
      let errorMessage = `Failed to delete customer: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(text);
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch (e) {
        // If JSON parsing fails, use raw text
        if (text) {
          errorMessage = text;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    console.log('Delete successful');
  } catch (error) {
    console.error('Delete Error:', {
      message: error.message,
      stack: error.stack,
      apiUrl: `${API_BASE}/Customer/${id}`
    });
    throw error;
  }
};

const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:5158/api'
  : '/api';

console.log('Store API base URL:', API_BASE);

export const getStores = async () => {
  try {
    const response = await fetch(`${API_BASE}/Store`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Store API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
      });
      throw new Error(`Failed to fetch stores: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error(`Network error: ${error.message}`);
  }
};

export const getStore = async (id) => {
  const response = await fetch(`${API_BASE}/Store/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch store');
  }
  return await response.json();
};

export const createStore = async (store) => {
  const response = await fetch(`${API_BASE}/Store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(store),
  });
  if (!response.ok) {
    throw new Error('Failed to create store');
  }
  return await response.json();
};

export const updateStore = async (id, store) => {
  try {
    console.log('Sending update request:', { id, store });
    const response = await fetch(`${API_BASE}/Store/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        name: store.Name,
        address: store.Address
      }),
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Update store error response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: text
      });
      throw new Error(`Failed to update store: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Update store success:', data);
    return data;
  } catch (error) {
    console.error('Update store failed:', error);
    throw error;
  }
};

export const deleteStore = async (id) => {
  try {
    console.log('Deleting store with id:', id);
    const response = await fetch(`${API_BASE}/Store/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Delete store error response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: text
      });
      throw new Error(`Failed to delete store: ${response.status} ${response.statusText}`);
    }
    
    console.log('Store deleted successfully');
  } catch (error) {
    console.error('Delete store failed:', error);
    throw error;
  }
};

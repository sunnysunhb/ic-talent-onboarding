import { useState } from 'react';
import './common/Dialog.css';

function DeleteConfirmDialog({ 
  open, 
  item, 
  onClose, 
  onSuccess,
  deleteFunction,
  itemName = 'item'
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item || !item.Id) {
      setError(`Invalid ${itemName} data`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Attempting to delete ${itemName}:`, {
        id: item.Id,
        name: item.Name || item.Title
      });

      await deleteFunction(item.Id);
      console.log('Delete operation successful');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Delete operation failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>Confirm Delete</h2>
        {error && <div className="error">{error}</div>}
        <p>Are you sure you want to delete {item?.Name || item?.Title}?</p>
        <div className="dialog-actions">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={loading}
            className="danger"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmDialog;

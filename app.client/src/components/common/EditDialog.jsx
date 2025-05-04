/**
 * Edit Dialog Component
 * Features: Provides a generic edit form interface
 * Data Flow:
 * 1. Receives initial data (item) from parent component
 * 2. Renders form fields (fields configuration)
 * 3. Submits modified data (apiMethod)
 * 4. Handles success/failure callbacks
 */
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Dialog.css';

/**
 * Main Edit Dialog Component
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onClose - Callback when dialog closes
 * @param {function} onSuccess - Callback on successful operation
 * @param {string} title - Dialog title
 * @param {Array} fields - Form fields configuration
 * @param {function} apiMethod - API method to call
 * @param {object} item - Data item to edit
 */
const EditDialog = ({
  open,
  onClose,
  onSuccess,
  title,
  fields,
  apiMethod,
  item
}) => {
  const initialFormData = fields.reduce((acc, field) => {
    // Use uppercase property names consistently
    const fieldValue = item?.[field.name] || 
                      item?.[field.name.charAt(0).toUpperCase() + field.name.slice(1)] || '';
    acc[field.name] = fieldValue;
    return acc;
  }, {});
  
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      const newFormData = fields.reduce((acc, field) => {
        // Use uppercase property names consistently
        const fieldValue = item[field.name] || 
                          item[field.name.charAt(0).toUpperCase() + field.name.slice(1)] || '';
        acc[field.name] = fieldValue;
        return acc;
      }, {});
      setFormData(newFormData);
    }
  }, [item]);

  /**
   * Handle form submission
   * 1. Prevent default form submission
   * 2. Call API method to update data
   * 3. Trigger onSuccess callback and close dialog on success
   * 4. Show error message on failure
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data - item:', item, 'formData:', formData);
    
    // Debug log - check item object structure
    console.log('Item object keys:', item ? Object.keys(item) : 'null');
    
    if (!item || !('Id' in item)) {
      console.error('Invalid item object:', item);
      setError('Missing item ID');
      return;
    }
    
    // Check if all required fields are filled
    const missingFields = fields
      .filter(field => field.required !== false)
      .filter(field => !formData[field.name]);
    
    if (missingFields.length > 0) {
      setError('Please fill all required fields');
      return;
    }

    try {
      // Convert number type fields
      const submitData = {};
      fields.forEach(field => {
        submitData[field.name] = field.type === 'number' 
          ? Number(formData[field.name])
          : formData[field.name];
      });
      
      console.log('Calling apiMethod with:', {
        Id: item.Id,
        ...submitData
      });
      
      // Ensure ID is included in request body
      const result = await apiMethod(item.Id, {
        Id: item.Id,
        ...submitData
      });
      console.log('API call successful:', result);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('API call failed:', err);
      setError(err.message);
    }
  };

  /**
   * Handle form field changes
   * @param {Object} e - Event object
   * Updates the state value of corresponding field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value); // Debug log
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>{title}</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label>{field.label}:</label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required !== false}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'date' ? (
                <DatePicker
                  selected={formData[field.name] ? new Date(formData[field.name]) : null}
                  onChange={(date) => handleChange({
                    target: {
                      name: field.name,
                      value: date
                    }
                  })}
                  dateFormat="yyyy/MM/dd"
                  locale="en"
                  className="date-picker-input"
                  required={field.required !== false}
                  {...field.inputProps}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required !== false}
                />
              )}
            </div>
          ))}
          <div className="dialog-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDialog;

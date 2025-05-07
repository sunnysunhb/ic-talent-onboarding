import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Dialog.css';

const AddDialog = ({ 
  open,
  onClose,
  onSuccess,
  title,
  fields,
  apiMethod
}) => {
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
    return acc;
  }, {});
  
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiMethod(formData);
      onSuccess();
      onClose();
      setFormData(initialFormData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                <>
                  {field.filterProps && (
                    <input
                      type="text"
                      placeholder={field.filterProps.placeholder}
                      value={field.filterProps.value}
                      onChange={field.filterProps.onChange}
                      className="filter-input"
                    />
                  )}
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required !== false}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </>
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

export default AddDialog;

import React, { useState } from 'react';

const UpdateChatDialog = ({ chat, onUpdate, onCancel }) => {
  const [firstName, setFirstName] = useState(chat.firstName || '');
  const [lastName, setLastName] = useState(chat.lastName || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onUpdate({ ...chat, firstName, lastName });
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h3 className="dialog-title">Update Chat</h3>
        </div>
        <div className="dialog-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label htmlFor="firstName" className="block mb-1">First Name *</label>
              <input
                type="text"
                id="firstName"
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <div className="error">{errors.firstName}</div>}
            </div>
            <div className="mb-1">
              <label htmlFor="lastName" className="block mb-1">Last Name *</label>
              <input
                type="text"
                id="lastName"
                className="input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <div className="error">{errors.lastName}</div>}
            </div>
          </form>
        </div>
        <div className="dialog-footer">
          <button className="button" onClick={onCancel}>Cancel</button>
          <button className="button" onClick={handleSubmit}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateChatDialog;
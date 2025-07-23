import React, { useState } from 'react';
import './SuperUser.css';

const SuperUser = () => {
  const [users, setUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddUserClick = () => {
    setFormVisible(true);
    setFormData({ name: '', email: '', role: '', status: 'active' });
    setEditingUser(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingUser !== null) {
      const updated = [...users];
      updated[editingUser] = formData;
      setUsers(updated);
    } else {
      setUsers(prev => [...prev, formData]);
    }
    setFormVisible(false);
  };

  const handleEditUser = (index) => {
    setEditingUser(index);
    setFormData(users[index]);
    setFormVisible(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="superuser-container">
      <h1 className="page-title">Superuser - Manage Users</h1>

      <div className="form-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="primary-button" onClick={handleAddUserClick}>
          + Add User
        </button>
      </div>

      {formVisible && (
        <form className="user-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            required
            value={formData.role}
            onChange={handleInputChange}
          />
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <button type="submit" className="primary-button">
            {editingUser !== null ? 'Update User' : 'Add User'}
          </button>
        </form>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className="edit-button" onClick={() => handleEditUser(index)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SuperUser;

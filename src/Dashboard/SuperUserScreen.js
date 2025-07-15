import React, { useEffect, useState } from 'react';
import './SuperUserScreen.css';

const SuperUserDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [workspaces, setWorkspaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'developer',
    status: 'active',
    workspaceId: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filterMonth]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/superuser/dashboard?month=${filterMonth}`);
      const data = await res.json();
      setAnalytics(data.analytics);
      setWorkspaces(data.workspaces);
      setUsers(data.allUsers || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/superuser/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const addedUser = await response.json();

        // Optimistically update the whole UI before refetch
        setUsers(prev => [addedUser, ...prev]);

        // Optionally refetch the entire database 
        fetchDashboardData();
      }

      // Reset form
      setShowModal(false);
      setNewUser({
        name: '',
        email: '',
        role: 'developer',
        status: 'active',
        workspaceId: ''
      });
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const handleEnterWorkspace = (workspaceId) => {
    alert(`Entering workspace: ${workspaceId}`);
  };

  return (
    <div className="superuser-dashboard-container">
      <h1 className="page-title">SuperUser Dashboard</h1>

      <div className="dashboard-header">
        <div className="filter">
          <label>Filter by Month:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
        </div>

        <button className="primary-button" onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      <div className="analytics-summary">
        <div className="card">
          <h2>{analytics.totalWorkspaces || 0}</h2>
          <p>Total Workspaces</p>
        </div>
        <div className="card">
          <h2>{analytics.totalUsers || 0}</h2>
          <p>Total Users</p>
        </div>
        <div className="card green">
          <h2>{analytics.activeUsers || 0}</h2>
          <p>Active Users</p>
        </div>
        <div className="card red">
          <h2>{analytics.suspenderUsers || 0}</h2>
          <p>Suspended Users</p>
        </div>
      </div>

      <div className="workspace-list-section">
        <h2>All Workspaces</h2>
        <ul className="workspace-list">
          {workspaces.map(ws => (
            <li key={ws.id} className="workspace-item">
              <div>
                <strong>{ws.name}</strong><br />
                <small>Created: {new Date(ws.createdAt).toLocaleDateString()}</small>
              </div>
              <button className="primary-button" onClick={() => handleEnterWorkspace(ws.id)}>
                Enter Workspace
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="user-list-section">
        <h2>All Users</h2>
        <ul className="user-list">
          {[...users].map(user => (
            <li key={user.uid || user.email} className="user-item">
              <div>
                <strong>{user.name}</strong> - {user.role}<br />
                <small>{user.email}</small>
              </div>
              <span className={`status ${user.status}`}>{user.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New User</h3>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="developer">Developer</option>
              <option value="product_owner">Product Owner</option>
              <option value="project_manager">Project Manager</option>
            </select>
            <input
              type="text"
              placeholder="Workspace ID"
              value={newUser.workspaceId}
              onChange={(e) => setNewUser({ ...newUser, workspaceId: e.target.value })}
            />
            <div className="modal-actions">
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirm" onClick={handleAddUser }>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperUserDashboard;


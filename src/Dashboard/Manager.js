// src/pages/Manager.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const trendData = [
  { week: 'Week 1', velocity: 20, bugs: 12 },
  { week: 'Week 2', velocity: 30, bugs: 9 },
  { week: 'Week 3', velocity: 40, bugs: 7 },
  { week: 'Week 4', velocity: 48, bugs: 4 },
];

// Dummy user list from Super Admin
const superAdminUsers = [
  'Ahsan Khan',
  'Maria Ahmed',
  'Ali Raza',
  'Zoya Rehman',
];

function Manager() {
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [addedUsers, setAddedUsers] = useState([]);
  const [tokens, setTokens] = useState({});

  const handleAddUser = (e) => {
    e.preventDefault();
    const selectedUser = e.target.user.value;
    if (selectedUser && !addedUsers.includes(selectedUser)) {
      setAddedUsers([...addedUsers, selectedUser]);
      setTokens({ ...tokens, [selectedUser]: '' });
    }
    e.target.reset();
  };

  const handleTokenChange = (user, value) => {
    setTokens({ ...tokens, [user]: value });
  };

  const handleAssignTokens = () => {
    console.log('Assigned Tokens:', tokens);
    alert('Tokens assigned!');
  };

  return (
    <>
      <header className="top-nav">
        <h1>scrum.ai</h1>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Team Insights</li>
            <li>Analytics</li>
            <li>Trends</li>
            <li>Notifications</li>
          </ul>
        </nav>
        <Link to="/developer" className="user-info">
          <span className="user-icon">👤</span>
          <span className="user-name">Project Manager</span>
        </Link>
      </header>

      <main className="container">

        <div className="search-bar">
          <input type="text" placeholder="Search team, tasks..." />
        </div>

        {/* Team Add Button */}
        {!showAddTeam && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button onClick={() => setShowAddTeam(true)} className="primary-button">+ Add Team</button>
          </div>
        )}

        {/* Add Team Form */}
        {showAddTeam && (
          <div className="card">
            <h3>Add Users to Workspace Team</h3>
            <form onSubmit={handleAddUser}>
              <select name="user" required style={{ padding: '10px', width: '100%', marginBottom: '10px' }}>
                <option value="">Select a user</option>
                {superAdminUsers.map((user, idx) => (
                  <option key={idx} value={user}>{user}</option>
                ))}
              </select>
              <button type="submit" className="primary-button">Add to Team</button>
            </form>
          </div>
        )}

      
      {/* Token Assignment Section */}
{addedUsers.length > 0 && (
  <div className="card assign" style={{ marginTop: '30px' }}>
    <h2>Assign Work Tokens</h2>
    {addedUsers.map((user, idx) => (
      <div key={idx} style={{ marginBottom: '20px' }}>
        <label><strong>{user}</strong></label>
        <input
          type="text"
          placeholder="Task name (e.g., Fix login bug)"
          value={tokens[user]?.task || ''}
          onChange={(e) =>
            setTokens({
              ...tokens,
              [user]: {
                ...tokens[user],
                task: e.target.value
              }
            })
          }
          style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '8px' }}
        />
        <input
          type="number"
          placeholder="Tokens (e.g., 3)"
          value={tokens[user]?.token || ''}
          onChange={(e) =>
            setTokens({
              ...tokens,
              [user]: {
                ...tokens[user],
                token: e.target.value
              }
            })
          }
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
    ))}
    <button onClick={() => {
      console.log('Assigned Tokens:', tokens);
      alert('Tokens assigned successfully!');
    }} className="primary-button">
      Assign Tokens
    </button>
  </div>
)}

        <div className="side-by-side" style={{ marginTop: '40px' }}>
          <section className="card summary">
            <h2>Team Summary</h2>
            <p><strong>Developers Active:</strong> {addedUsers.length}</p>
            <p><strong>Tasks In Progress:</strong> 12</p>
            <p><strong>Blockers Reported:</strong> 2</p>
          </section>

          <section className="card performance">
            <h2>Performance Analytics</h2>
            <ul>
              <li><strong>Avg Task Completion:</strong> 3.2 days</li>
              <li><strong>Standup Compliance:</strong> 85%</li>
              <li><strong>Code Review Throughput:</strong> High</li>
            </ul>
          </section>
        </div>

        <div className="side-by-side">
          <section className="card trends">
            <h2>Delivery Trends</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="velocity" stroke="#3f51b5" />
                <Line type="monotone" dataKey="bugs" stroke="#e53935" />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>
      </main>

      <footer className="bottom-nav">
        <ul>
          <li>Home</li>
          <li>Analytics</li>
          <li>Team</li>
          <li>Notification</li>
        </ul>
      </footer>
    </>
  );
}

export default Manager;

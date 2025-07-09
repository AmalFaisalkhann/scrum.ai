import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterWorkspace.css';

const EnterWorkspace = () => {
  const [email, setEmail] = useState('');
  const [workspaces, setWorkspaces] = useState({
    'owner@example.com': ['MarketingSprint', 'DevTeam'],
    'manager@company.com': ['FinanceTeam'],
  });

  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const navigate = useNavigate();

  const handleCheckWorkspaces = () => {
    if (!email) return;
    const found = workspaces[email] || [];
    setUserWorkspaces(found);
  };

  const handleEnterWorkspace = (workspaceName) => {
    navigate('/Productowner', {
      state: {
        email,
        workspace: workspaceName,
      },
    });
  };

  return (
    <div className="enter-workspace-container">
      <h1 className="page-title">Enter Workspace</h1>

      <div className="form-section">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleCheckWorkspaces}>Proceed To Login</button>
      </div>

      {userWorkspaces.length > 0 && (
        <ul className="workspace-list">
          {userWorkspaces.map((ws, index) => (
            <li key={index}>
              {ws}
              <button onClick={() => handleEnterWorkspace(ws)}>
                Enter
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnterWorkspace;

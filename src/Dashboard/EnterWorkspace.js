import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterWorkspace.css';

const EnterWorkspace = () => {
  const [email, setEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const navigate = useNavigate();

  const handleProceedToLogin = () => {
    if (email && workspaceName) {
      navigate('/login', {
        state: { email, workspace: workspaceName }
      });
    }
  };

  return (
    <div className="workspace-container">
      <h1 className="page-title">Enter Workspace</h1>

      <div className="workspace-setup">
        <input
          type="email"
          placeholder="Enter workspace email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter workspace name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />

        <button onClick={handleProceedToLogin}>Proceed To Login</button>
      </div>
    </div>
  );
};

export default EnterWorkspace;

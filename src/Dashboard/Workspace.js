import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Workspace.css';

const Workspace = () => {
  const [email, setEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaces, setWorkspaces] = useState({});
  const [currentUser, setCurrentUser] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState('');
  const navigate = useNavigate();

  const handleCreateWorkspace = () => {
    if (!email || !workspaceName) return;

    setWorkspaces(prev => ({
      ...prev,
      [email]: [...(prev[email] || []), workspaceName]
    }));

    setCurrentUser(email);
    setEmail('');
    setWorkspaceName('');
  };

  const handleEnterWorkspace = (workspace) => {
    setActiveWorkspace(workspace);
    // Navigate to the Product Owner dashboard and pass workspace name
    navigate('/Productowner', { state: { workspace, email: currentUser } });
  };

  const handleSwitchWorkspace = () => {
    setActiveWorkspace('');
  };

  const userWorkspaces = workspaces[currentUser] || [];

  return (
    <div className="workspace-container">
      <h1 className="page-title">Workspace Management</h1>

      {!activeWorkspace ? (
        <>
          <div className="workspace-setup">
            <input
              type="email"
              placeholder="Enter your product owner email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter new workspace name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <button onClick={handleCreateWorkspace}>Create Workspace</button>
          </div>

          {userWorkspaces.length > 0 && (
            <>
              <h2 className="section-subtitle">Your Workspaces</h2>
              <ul className="workspace-list">
                {userWorkspaces.map((ws, idx) => (
                  <li key={idx}>
                    <span>{ws}</span>
                    <div className="workspace-actions">
                      <button onClick={() => handleEnterWorkspace(ws)}>Enter Workspace</button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <>
          <button className="switch-button" onClick={handleSwitchWorkspace}>
            Switch Workspace
          </button>
        </>
      )}
    </div>
  );
};

export default Workspace;


import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Userroles.css';

function Roles() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem('selectedRole', role); // optionally store role
    navigate('/login'); // navigate to login screen
  };

  return (
    <div className="role-selection-container">
      <h1 className="role-heading">SCRUM.AI</h1>
      <p className="role-subheading">Choose your role to get started</p>

      <div className="role-cards">
        <div className="role-card developer" onClick={() => handleRoleSelect('Developer')}>
          <div className="role-icon">💻</div>
          <h2>Developer</h2>
          <p>Build and implement features, write code, and collaborate with the team</p>
        </div>

        <div className="role-card project-manager" onClick={() => handleRoleSelect('Project Manager')}>
          <div className="role-icon">📂</div>
          <h2>Project Manager</h2>
          <p>Coordinate projects, manage timelines, and ensure delivery</p>
        </div>

        <div className="role-card product-owner" onClick={() => handleRoleSelect('Product Owner')}>
          <div className="role-icon">🧭</div>
          <h2>Product Owner</h2>
          <p>Define product vision, prioritize backlog, and maximize value</p>
        </div>
      </div>

      
    </div>
  );
}

export default Roles;

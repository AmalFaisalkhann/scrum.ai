// src/Dashboard/Productowner.js

import React from 'react';
import './Productowner.css';

function ProductOwner() {
  return (
    <>
      {/* Header */}
      <header className="top-nav">
        <h1>scrum.ai</h1>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Team Insights</li>
            <li>Feedback</li>
            <li>Notifications</li>
          </ul>
        </nav>
        <div className="user-info">
          <span className="user-icon">🧑</span>
          <span className="user-name">Owner</span>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container">
        {/* Search */}
        <input type="text" placeholder="Search standups, feedback..." />

        {/* Standup Summaries */}
        <section className="card">
          <h2>Daily Standup Summaries</h2>
          <ul>
            <li><strong>Ahmed:</strong> Completed backend integration. Blocked on API testing.</li>
            <li><strong>Fatima:</strong> Worked on UI fixes. Will start deployment tasks.</li>
            <li><strong>Bilal:</strong> Resolved database schema issues. No blockers.</li>
          </ul>
        </section>

        {/* Feedback Panel */}
        <section className="card">
          <h2>Team Feedback Panel</h2>
          <textarea placeholder="Add feedback or observations about team performance..."></textarea>
          <button>Submit Feedback</button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bottom-nav">
        <ul>
          <li>🏠 Home</li>
          <li>📋 Standups</li>
          <li>💬 Feedback</li>
          <li>🔔 Notifications</li>
        </ul>
      </footer>
    </>
  );
}

export default ProductOwner;

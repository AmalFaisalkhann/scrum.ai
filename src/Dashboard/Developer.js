// src/pages/Developer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Developer() {
  // Sample data for assigned projects and tokens
  const assignedProjects = [
    {
      name: 'AI Dashboard',
      timeline: 'July 20 - Aug 10',
      tokens: [
        { tokenId: 'TK-123', task: 'Fix API bug', status: 'In Progress' },
        { tokenId: 'TK-125', task: 'Implement chart view', status: 'Todo' },
      ],
    },
    {
      name: 'Login Revamp',
      timeline: 'Aug 1 - Aug 5',
      tokens: [
        { tokenId: 'TK-127', task: 'Add forgot password', status: 'Done ✅' },
      ],
    },
  ];

  return (
    <>
      <header className="top-nav">
        <h1>scrum.ai</h1>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Sprint Standups</li>
            <li>My Projects</li>
            <li>Team Updates</li>
            <li>Notifications</li>
          </ul>
        </nav>
        <Link to="/manager" className="user-info">
          <span className="user-name">Dev</span>
        </Link>
      </header>

      <main className="container">
        <div className="search-bar">
          <input type="text" placeholder="Search tasks, updates..." />
        </div>

        <div className="side-by-side">
          <section className="card standup">
            <h2>Submit Daily Standup</h2>
            <textarea placeholder="What did you do yesterday? Today? Any blockers?" />
            <button>Submit</button>
          </section>

          <section className="card projects">
            <h2>My Assigned Projects</h2>
            {assignedProjects.map((project, index) => (
              <div key={index} className="project-block">
                <h3>{project.name}</h3>
                <p><strong>Timeline:</strong> {project.timeline}</p>
                <ul>
                  {project.tokens.map((token, idx) => (
                    <li key={idx}>
                      <strong>{token.tokenId}</strong>: {token.task} — <em>{token.status}</em>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </main>

      <footer className="bottom-nav">
        <ul>
          <li>Home</li>
          <li>Submit</li>
          <li>Projects</li>
          <li>Notification</li>
        </ul>
      </footer>
    </>
  );
}

export default Developer;
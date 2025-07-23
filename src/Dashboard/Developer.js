// src/pages/Developer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Developer() {
  return (
    <>
      <header className="top-nav">
        <h1>scrum.ai</h1>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Sprint Standups</li>
            <li>My Tasks</li>
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

          <section className="card tasks">
            <h2>My Tasks</h2>
            <div className="task">
              <h3>Integrate backend API</h3>
              <progress value="60" max="100" />
              <p>Status: In Progress</p>
            </div>
            <div className="task">
              <h3>Update project documentation</h3>
              <progress value="20" max="100" />
              <p>Status: Todo</p>
            </div>
            <div className="task">
              <h3>Code review: Auth module</h3>
              <progress value="100" max="100" />
              <p>Status: Done ✅</p>
            </div>
          </section>
        </div>

        <section className="card ai-suggestions">
          <h2>AI Suggestions</h2>
          <ul>
            <li> Prioritize high-effort tasks first.</li>
            <li>"project doc" is delayed — recommend splitting.</li>
          </ul>
        </section>
      </main>

      <footer className="bottom-nav">
        <ul>
          <li> Home</li>
          <li>Submit</li>
          <li> Task</li>
          <li>Notification</li>
        </ul>
      </footer>
    </>
  );
}

export default Developer;
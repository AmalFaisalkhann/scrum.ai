// src/pages/Manager.js
import React from 'react';
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

function Manager() {
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
          <span className="user-name">Manager</span>
        </Link>
      </header>

      <main className="container">
        <div className="search-bar">
          <input type="text" placeholder="Search team, tasks..." />
        </div>

        <div className="side-by-side">
          <section className="card summary">
            <h2>Team Summary</h2>
            <p><strong>Developers Active:</strong> 4</p>
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
              <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="velocity" stroke="#3f51b5" name="Velocity" />
                <Line type="monotone" dataKey="bugs" stroke="#e53935" name="Bugs" />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="card assign">
            <h2>Assign Work Tokens</h2>
            <label>
              Dev Name:
              <input type="text" placeholder="e.g. Ahsan" />
            </label>
            <label>
              Tokens:
              <input type="number" placeholder="e.g. 5" />
            </label>
            <button>Assign</button>
          </section>
        </div>
      </main>

      <footer className="bottom-nav">
        <ul>
          <li>🏠 Home</li>
          <li>📊 Analytics</li>
          <li>🧑‍💼 Team</li>
          <li>🔔 Notification</li>
        </ul>
      </footer>
    </>
  );
}

export default Manager;

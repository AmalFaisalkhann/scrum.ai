import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import "./ProjectStatus.css";

const ProjectStatus = ({ projectId }) => {
  const [projectData, setProjectData] = useState(null);
  const [standups, setStandups] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      // Load project state
      const stateResponse = await fetch(`http://localhost:8000/api/projects/${projectId}/state`);
      const stateData = await stateResponse.json();
      
      if (stateData.success) {
        setProjectData(stateData);
      } else {
        setError("Failed to load project data");
        return;
      }
      
      // Load standups
      const standupsResponse = await fetch(`http://localhost:8000/api/projects/${projectId}/standups`);
      const standupsData = await standupsResponse.json();
      
      if (standupsData.success) {
        setStandups(standupsData.standups);
      }
      
      // Load tickets
      const ticketsResponse = await fetch(`http://localhost:8000/api/projects/${projectId}/tickets`);
      const ticketsData = await ticketsResponse.json();
      
      if (ticketsData.success) {
        setTickets(ticketsData.tickets);
      }
      
    } catch (err) {
      console.error("Error loading project data:", err);
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserTickets = () => {
    if (!auth.currentUser) return [];
    return tickets.filter(ticket => 
      ticket.assigned_dev_id === auth.currentUser.uid ||
      ticket.assigned_dev_id === auth.currentUser.email
    );
  };

  const getCurrentUserStandups = () => {
    if (!auth.currentUser) return [];
    return standups.filter(standup => 
      standup.dev_id === auth.currentUser.uid ||
      standup.dev_id === auth.currentUser.email
    );
  };

  const getStatusColor = (state) => {
    switch (state) {
      case 'new': return '#ffc107';
      case 'running': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className="project-status-container">Loading project data...</div>;
  }

  if (error) {
    return <div className="project-status-container error">{error}</div>;
  }

  if (!projectData) {
    return <div className="project-status-container">Project not found</div>;
  }

  const userTickets = getCurrentUserTickets();
  const userStandups = getCurrentUserStandups();

  return (
    <div className="project-status-container">
      <div className="project-header">
        <h2>{projectData.name}</h2>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(projectData.state) }}
        >
          {projectData.state.toUpperCase()}
        </div>
      </div>

      <div className="project-description">
        <h3>Project Description</h3>
        <p>{projectData.description}</p>
      </div>

      <div className="project-team">
        <h3>Team Members</h3>
        <div className="team-list">
          {projectData.dev_profiles.map((dev, index) => (
            <div key={index} className="team-member">
              <div className="member-info">
                <div className="member-name">{dev.name}</div>
                <div className="member-email">{dev.email}</div>
                <div className="member-role">{dev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="user-tickets">
        <h3>Your Assigned Tickets</h3>
        {userTickets.length > 0 ? (
          <div className="tickets-list">
            {userTickets.map((ticket, index) => (
              <div key={index} className="ticket-item">
                <div className="ticket-header">
                  <h4>{ticket.title}</h4>
                  <span className={`priority-badge ${ticket.priority}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="ticket-description">{ticket.description}</p>
                <div className="ticket-meta">
                  <span className="ticket-status">{ticket.status}</span>
                  <span className="ticket-hours">{ticket.estimated_hours}h</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-tickets">No tickets assigned to you yet.</p>
        )}
      </div>

      <div className="user-standups">
        <h3>Your Standups</h3>
        {userStandups.length > 0 ? (
          <div className="standups-list">
            {userStandups.map((standup, index) => (
              <div key={index} className="standup-item">
                <div className="standup-header">
                  <span className="cycle-number">Cycle {standup.cycle}</span>
                  <span className="standup-date">
                    {new Date(standup.timestamp?.toDate?.() || standup.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="standup-content">
                  <div className="standup-section">
                    <strong>Yesterday:</strong> {standup.yesterday_work}
                  </div>
                  <div className="standup-section">
                    <strong>Today:</strong> {standup.today_plan}
                  </div>
                  <div className="standup-section">
                    <strong>Blockers:</strong> {standup.blockers}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-standups">No standups submitted yet.</p>
        )}
      </div>

      <div className="project-summaries">
        <h3>Project Summaries</h3>
        {projectData.cycle_0_summary && (
          <div className="summary-item">
            <h4>Cycle 0 Summary</h4>
            <p>{projectData.cycle_0_summary}</p>
          </div>
        )}
        {projectData.cycle_1_summary && (
          <div className="summary-item">
            <h4>Cycle 1 Summary</h4>
            <p>{projectData.cycle_1_summary}</p>
          </div>
        )}
        {projectData.cycle_2_summary && (
          <div className="summary-item">
            <h4>Cycle 2 Summary</h4>
            <p>{projectData.cycle_2_summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectStatus; 
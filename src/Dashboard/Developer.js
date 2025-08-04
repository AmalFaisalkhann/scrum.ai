// src/pages/Developer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import StandupSubmission from './StandupSubmission';
import '../App.css';
import './Developer.css';

function Developer() {
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showStandupForm, setShowStandupForm] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

    const loadUserData = async () => {
    if (!auth.currentUser) {
      console.log('No authenticated user');
      setLoading(false);
      return;
    }

    console.log('Loading user data for:', auth.currentUser.email, auth.currentUser.uid);

    try {
      setLoading(true);
      
      // Get all projects where the current user is a developer
      // First, get all projects and filter them
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projects = [];
      
      for (const projectDoc of projectsSnapshot.docs) {
        const projectData = projectDoc.data();
        const devProfiles = projectData.dev_profiles || [];
        
        // Check if current user is in the dev_profiles
        const isUserInProject = devProfiles.some(dev => 
          dev.user_id === auth.currentUser.uid || 
          dev.id === auth.currentUser.uid ||
          dev.email === auth.currentUser.email
        );
        
        console.log(`Project ${projectDoc.id}: User in project = ${isUserInProject}, dev profiles:`, devProfiles);
        
        if (isUserInProject) {
          // Get tickets for this project - check both locations
          const tickets = [];
          
          // Check if current user has tickets in their dev profile
          const userDevId = devProfiles.find(dev => 
            dev.user_id === auth.currentUser.uid || 
            dev.id === auth.currentUser.uid ||
            dev.email === auth.currentUser.email
          )?.id;
          
          console.log(`User dev ID: ${userDevId}`);
          
          // Method 1: Check main tickets collection
          try {
            const mainTicketsQuery = query(
              collection(db, `projects/${projectDoc.id}/tickets`),
              where('assigned_dev_id', '==', userDevId)
            );
            
            const mainTicketsSnapshot = await getDocs(mainTicketsQuery);
            const mainTickets = mainTicketsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            tickets.push(...mainTickets);
            console.log(`Found ${mainTickets.length} tickets in main collection for dev ${userDevId}`);
          } catch (error) {
            console.error(`Error fetching main tickets for dev ${userDevId}:`, error);
          }
          
          // Method 2: Check dev profile tickets collection
          if (userDevId) {
            try {
              const devTicketsQuery = query(
                collection(db, `projects/${projectDoc.id}/dev_profiles/${userDevId}/tickets`)
              );
              
              const devTicketsSnapshot = await getDocs(devTicketsQuery);
              const devTickets = devTicketsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              tickets.push(...devTickets);
              console.log(`Found ${devTickets.length} tickets in dev profile collection for dev ${userDevId}`);
            } catch (error) {
              console.error(`Error fetching dev profile tickets for dev ${userDevId}:`, error);
            }
          }
          
          console.log(`Total tickets found for project ${projectDoc.id}: ${tickets.length}`);
          projects.push({
            id: projectDoc.id,
            ...projectData,
            tickets: tickets
          });
        }
      }
      
      setUserProjects(projects);
      
      // Flatten all tickets for the main view
      const allTickets = projects.flatMap(project => 
        project.tickets.map(ticket => ({
          ...ticket,
          projectName: project.name,
          projectId: project.id
        }))
      );
      
      setAssignedTickets(allTickets);
      
      if (projects.length > 0) {
        setSelectedProject(projects[0]);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'done':
        return '#28a745';
      case 'in progress':
      case 'working':
        return '#ffc107';
      case 'todo':
      case 'pending':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="developer-container">
        <div className="loading">Loading your assignments...</div>
      </div>
    );
  }

  return (
    <div className="developer-container">
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
        <div className="user-info">
          <span className="user-name">Developer</span>
          <span className="user-email">{auth.currentUser?.email}</span>
        </div>
      </header>

      <main className="developer-main">
        <div className="developer-header">
          <h2>Developer Dashboard</h2>
          <button 
            className="standup-button"
            onClick={() => setShowStandupForm(!showStandupForm)}
          >
            {showStandupForm ? 'Hide Standup Form' : 'Submit Daily Standup'}
          </button>
        </div>

        {showStandupForm && (
          <div className="standup-section">
            <StandupSubmission />
          </div>
        )}

        <div className="dashboard-content">
          <div className="tickets-section">
            <h3>My Assigned Tickets ({assignedTickets.length})</h3>
            {assignedTickets.length === 0 ? (
              <div className="no-tickets">
                <p>No tickets assigned to you yet.</p>
                <p>Check back later or contact your manager.</p>
              </div>
            ) : (
              <div className="tickets-grid">
                {assignedTickets.map((ticket, index) => (
                  <div key={index} className="ticket-card">
                    <div className="ticket-header">
                      <h4>{ticket.title}</h4>
                      <div className="ticket-badges">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(ticket.status) }}
                        >
                          {ticket.status}
                        </span>
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="ticket-meta">
                      <span className="project-name">Project: {ticket.projectName}</span>
                      <span className="estimated-hours">{ticket.estimated_hours}h</span>
                    </div>
                    <div className="ticket-footer">
                      <span className="ticket-id">#{ticket.id}</span>
                      <span className="assigned-date">
                        {ticket.assigned_at ? 
                          new Date(ticket.assigned_at.toDate()).toLocaleDateString() : 
                          'Recently assigned'
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="projects-section">
            <h3>My Projects ({userProjects.length})</h3>
            {userProjects.length === 0 ? (
              <div className="no-projects">
                <p>You're not assigned to any projects yet.</p>
              </div>
            ) : (
              <div className="projects-list">
                {userProjects.map((project, index) => (
                  <div key={index} className="project-card">
                    <div className="project-header">
                      <h4>{project.name}</h4>
                      <span 
                        className="project-status"
                        style={{ backgroundColor: getStatusColor(project.state) }}
                      >
                        {project.state}
                      </span>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-stats">
                      <span>Assigned Tickets: {project.tickets.length}</span>
                      <span>Created: {project.created_at ? 
                        new Date(project.created_at.toDate()).toLocaleDateString() : 
                        'Unknown'
                      }</span>
                    </div>
                    <div className="project-tickets">
                      <h5>Your Tickets in this Project:</h5>
                      {project.tickets.length === 0 ? (
                        <p>No tickets assigned yet</p>
                      ) : (
                        <ul>
                          {project.tickets.slice(0, 3).map((ticket, idx) => (
                            <li key={idx}>
                              <strong>{ticket.title}</strong> - {ticket.status}
                            </li>
                          ))}
                          {project.tickets.length > 3 && (
                            <li>... and {project.tickets.length - 3} more</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
    </div>
  );
}

export default Developer;
import React, { useState, useEffect } from 'react';
import '../App.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db, auth } from '../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, where, arrayUnion
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { apiService } from '../services/api';

const dummyTrends = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 60 },
  { name: 'Thu', value: 40 },
  { name: 'Fri', value: 70 },
];

// State badge component
const StateBadge = ({ state }) => {
  const getStateColor = (state) => {
    switch (state) {
      case 'new': return '#ff9800'; // Orange
      case 'running': return '#2196f3'; // Blue
      case 'waiting': return '#ff5722'; // Red
      case 'completed': return '#4caf50'; // Green
      default: return '#9e9e9e'; // Grey
    }
  };

  const getStateText = (state) => {
    switch (state) {
      case 'new': return 'New';
      case 'running': return 'Running';
      case 'waiting': return 'Waiting';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <span
      style={{
        backgroundColor: getStateColor(state),
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}
    >
      {getStateText(state)}
    </span>
  );
};

const Manager = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', id: '', timeline: '', state: 'new' });
  const [teamData, setTeamData] = useState({ user: '', token: '' });
  const [developerUsers, setDeveloperUsers] = useState([]);
  const [backendStatus, setBackendStatus] = useState('unknown'); // Used in UI

  // Add CSS styles for project cards and state badges
  const projectCardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px 0',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease'
  };

  const stateSelectStyle = {
    marginLeft: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '12px',
    backgroundColor: '#fff'
  };

  useEffect(() => {
    const fetchProjects = async (user) => {
      const q = query(collection(db, 'projects'), where('created_by', '==', user.uid));
      const snapshot = await getDocs(q);
      const projectList = snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        docId: docSnap.id,
      }));
      setProjects(projectList);
    };

    const fetchDevelopers = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'Developer'));
      const snapshot = await getDocs(q);
      const devs = snapshot.docs.map(doc => doc.data().name || doc.data().email);
      setDeveloperUsers(devs);
    };

    const checkBackendStatus = async () => {
      try {
        await apiService.checkBackendStatus();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProjects(user);
        fetchDevelopers();
        checkBackendStatus();
      } else {
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProjectCreate = async () => {
    if (formData.name && formData.id && formData.timeline) {
      const docRef = await addDoc(collection(db, 'projects'), {
        name: formData.name,
        id: formData.id,
        timeline: formData.timeline,
        state: formData.state, // Include state in project creation
        created_by: auth.currentUser.uid,
        team: [],
        created_at: new Date()
      });
      await updateDoc(docRef, { project_id: docRef.id });
      setFormData({ name: '', id: '', timeline: '', state: 'new' });
      alert('Project created!');
      window.location.reload();
    }
  };

  const handleStateChange = async (projectId, newState) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'projects', projectId), {
        state: newState,
        state_updated_at: new Date()
      });
      
      // Also update via API if backend is available
      try {
        await apiService.updateProjectState(projectId, newState);
      } catch (apiError) {
        console.warn('Backend API not available, using Firestore only:', apiError);
      }
      
      // Update local state
      setProjects(projects.map(proj => 
        proj.docId === projectId 
          ? { ...proj, state: newState, state_updated_at: new Date() }
          : proj
      ));
      alert(`Project state updated to ${newState}`);
    } catch (error) {
      console.error('Error updating project state:', error);
      alert('Failed to update project state');
    }
  };

  const handleAddToTeam = async () => {
    if (!selectedProject?.docId || !teamData.user) return;
    const projRef = doc(db, 'projects', selectedProject.docId);
    await updateDoc(projRef, {
      team: arrayUnion({ ...teamData })
    });
    setTeamData({ user: '', token: '' });
    alert('Team member added!');
    window.location.reload();
  };

  const handleProjectDelete = async (id) => {
    const proj = projects.find(p => p.docId === id);
    if (proj?.docId) {
      await deleteDoc(doc(db, 'projects', proj.docId));
      alert('Project deleted!');
      setProjects(projects.filter(p => p.docId !== id));
      if (selectedProject?.docId === id) setSelectedProject(null);
    }
  };

  const handleProjectUpdate = async () => {
    if (!selectedProject?.docId) return;
    const projRef = doc(db, 'projects', selectedProject.docId);
    await updateDoc(projRef, {
      name: selectedProject.name,
      id: selectedProject.id,
      timeline: selectedProject.timeline
    });
    alert('Project updated!');
    window.location.reload();
  };

  const handleTaskDelete = async (index) => {
    if (!selectedProject?.docId) return;
    const updatedTeam = [...selectedProject.team];
    updatedTeam.splice(index, 1);
    await updateDoc(doc(db, 'projects', selectedProject.docId), { team: updatedTeam });
    setSelectedProject({ ...selectedProject, team: updatedTeam });
  };

  const handleTokenAssign = async (index, tokenValue) => {
    const updatedTeam = selectedProject.team.map((member, i) =>
      i === index ? { ...member, token: tokenValue } : member
    );
    await updateDoc(doc(db, 'projects', selectedProject.docId), { team: updatedTeam });
    setSelectedProject({ ...selectedProject, team: updatedTeam });
  };

  const countTeamInsights = () => {
    return projects.map((proj) => ({
      name: proj.name,
      members: proj.team ? proj.team.length : 0,
    }));
  };

  return (
    <div className="manager-container">
      <header className="top-nav">
        <h1>scrum.ai</h1>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Feedback</li>
            <li>Notifications</li>
          </ul>
        </nav>
        <div className="user-info">
          <span className="user-name">Manager</span>
          <div style={{ 
            marginLeft: '10px', 
            fontSize: '12px',
            color: backendStatus === 'connected' ? '#4caf50' : '#f44336'
          }}>
            Backend: {backendStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </header>

      <div className="section">
        <h2>+ Add Project</h2>
        <div className="project-form">
          <input 
            placeholder="Project Name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />
          <input 
            placeholder="Project Description" 
            value={formData.id} 
            onChange={(e) => setFormData({ ...formData, id: e.target.value })} 
          />
          <input 
            placeholder="Timeline (e.g. 1 week)" 
            value={formData.timeline} 
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} 
          />
          <select 
            value={formData.state} 
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="new">New</option>
            <option value="running">Running</option>
            <option value="waiting">Waiting</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleProjectCreate}>Create</button>
        </div>
      </div>

      <div className="section">
        <h2>View & Edit Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet. Add one above.</p>
        ) : (
          projects.map((proj, index) => (
            <div key={index} style={projectCardStyle} onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'} onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}>
              <div onClick={() => setSelectedProject(proj)}>
                <strong>{proj.name}</strong> | ID: {proj.id} | Timeline: {proj.timeline}
                <div style={{ marginTop: '8px' }}>
                  <StateBadge state={proj.state || 'new'} />
                  <select 
                    value={proj.state || 'new'} 
                    onChange={(e) => handleStateChange(proj.docId, e.target.value)}
                    style={stateSelectStyle}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="new">New</option>
                    <option value="running">Running</option>
                    <option value="waiting">Waiting</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <button onClick={() => handleProjectDelete(proj.docId)} style={{ marginLeft: '10px' }}>Delete</button>
            </div>
          ))
        )}
      </div>

      {selectedProject && (
        <div className="section">
          <h2>Manage Team for: {selectedProject.name}</h2>
          <div className="project-edit-form">
            <input value={selectedProject.name} onChange={(e) => setSelectedProject({ ...selectedProject, name: e.target.value })} />
            <input value={selectedProject.id} onChange={(e) => setSelectedProject({ ...selectedProject, id: e.target.value })} />
            <input value={selectedProject.timeline} onChange={(e) => setSelectedProject({ ...selectedProject, timeline: e.target.value })} />
            <button onClick={handleProjectUpdate}>Update Project</button>
          </div>

          <div className="team-form">
            <select value={teamData.user} onChange={(e) => setTeamData({ ...teamData, user: e.target.value })}>
              <option value="">Select Developer</option>
              {developerUsers.map((user, i) => (
                <option key={i} value={user}>{user}</option>
              ))}
            </select>
            <button onClick={handleAddToTeam}>Add to Team</button>
          </div>

          <div className="team-list">
            {!selectedProject.team || selectedProject.team.length === 0 ? (
              <p>No members in this project yet.</p>
            ) : (
              selectedProject.team.map((member, i) => (
                <div key={i} className="team-member-token">
                  <span>{member.user}</span>
                  <input
                    placeholder="Assign Token"
                    value={member.token || ''}
                    onChange={(e) => handleTokenAssign(i, e.target.value)}
                  />
                  <button onClick={() => handleTaskDelete(i)} style={{ marginLeft: '8px' }}>Remove</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="section">
        <h2>Delivery Trends</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dummyTrends}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4a90e2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="section">
        <h2>Team Insights</h2>
        {projects.length === 0 ? (
          <p>No data available</p>
        ) : (
          countTeamInsights().map((p, i) => (
            <p key={i}>{p.name} - {p.members} Members</p>
          ))
        )}
      </div>

      <div className="section">
        <h2>Performance Analysis</h2>
        <p>Most tasks completed by: Sara (12)</p>
      </div>

      <footer className="bottom-nav">
        <ul>
          <li>Home</li>
          <li>Submit</li>
          <li>Task</li>
          <li>Notification</li>
        </ul>
      </footer>
    </div>
  );
};

export default Manager;

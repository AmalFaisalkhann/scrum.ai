import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { db, auth } from '../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, where, arrayUnion
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const dummyTrends = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 60 },
  { name: 'Thu', value: 40 },
  { name: 'Fri', value: 70 },
];

const Manager = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '', id: '', timeline: '', selectedDevs: []
  });
  const [teamData, setTeamData] = useState({ user: '', token: '' });
  const [developerUsers, setDeveloperUsers] = useState([]);

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
      const devs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.name || '',
          email: data.email || '',
        };
      });
      setDeveloperUsers(devs);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProjects(user);
        fetchDevelopers();
      } else {
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProjectCreate = async () => {
    if (formData.name && formData.id && formData.timeline) {
      // Create team members array from selected developers
      const teamMembers = formData.selectedDevs.map(uid => {
        const user = developerUsers.find(dev => dev.uid === uid);
        return { user: user?.email || uid, token: '' };
      });

      const docRef = await addDoc(collection(db, 'projects'), {
        name: formData.name,
        id: formData.id,
        timeline: formData.timeline,
        created_by: auth.currentUser.uid,
        team: teamMembers,
        created_at: new Date()
      });

      await updateDoc(docRef, { project_id: docRef.id });

      // Reset form data
      setFormData({ name: '', id: '', timeline: '', selectedDevs: [] });
      alert('Project created successfully with selected developers!');
      
      // Refresh projects list
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'projects'), where('created_by', '==', user.uid));
        const snapshot = await getDocs(q);
        const projectList = snapshot.docs.map(docSnap => ({
          ...docSnap.data(),
          docId: docSnap.id,
        }));
        setProjects(projectList);
      }
    } else {
      alert('Please fill in all required fields (name, description, timeline)');
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
            placeholder="Timeline (e.g. 96 hours)" 
            value={formData.timeline} 
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} 
          />

          <div style={{ marginTop: '10px', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Select Developers (Hold Ctrl to select multiple):
            </label>
            <select
              multiple
              value={formData.selectedDevs}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, selectedDevs: selected });
              }}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '120px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              {developerUsers.map((dev) => (
                <option key={dev.uid} value={dev.uid}>
                  {dev.name || dev.email}
                </option>
              ))}
            </select>
            {formData.selectedDevs.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                Selected: {formData.selectedDevs.length} developer(s)
              </div>
            )}
          </div>

          <button onClick={handleProjectCreate}>Create Project</button>
        </div>
      </div>

      <div className="section">
        <h2>View & Edit Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet. Add one above.</p>
        ) : (
          projects.map((proj, index) => (
            <div key={index} className="project-card">
              <div onClick={() => setSelectedProject(proj)}>
                <strong>{proj.name}</strong> | ID: {proj.id} | Timeline: {proj.timeline}
                {proj.team && proj.team.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Team: {proj.team.length} member(s)
                  </div>
                )}
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
                <option key={i} value={user.email}>{user.name || user.email}</option>
              ))}
            </select>
            <button onClick={handleAddToTeam}>Add to Team</button>
          </div>

          <div className="team-list">
            <h3>Current Team Members:</h3>
            {!selectedProject.team || selectedProject.team.length === 0 ? (
              <p>No members in this project yet.</p>
            ) : (
              selectedProject.team.map((member, i) => (
                <div key={i} className="team-member-token">
                  <span style={{ minWidth: '150px' }}>{member.user}</span>
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
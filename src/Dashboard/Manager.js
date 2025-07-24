import React, { useState, useEffect } from 'react';
import '../App.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db, auth } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, arrayUnion, getDoc, setDoc } from 'firebase/firestore';

const usersFromSuperUser = ['Ali', 'Sara', 'Ahmed', 'Zainab']; // Sample users

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
  const [formData, setFormData] = useState({ name: '', id: '', timeline: '' });
  const [teamData, setTeamData] = useState({ user: '', task: '', count: '' });

  // Load projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'projects'), where('created_by', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const projectList = querySnapshot.docs.map(docSnap => ({ ...docSnap.data(), docId: docSnap.id }));
      setProjects(projectList);
    };
    fetchProjects();
  }, []);

  // Create project in Firestore
  const handleProjectCreate = async () => {
    try {
      if (formData.name && formData.id && formData.timeline) {
        await addDoc(collection(db, 'projects'), {
          name: formData.name,
          project_id: formData.id,
          timeline: formData.timeline,
          created_by: auth.currentUser.uid,
          team: [],
          created_at: new Date(),
        });
        setFormData({ name: '', id: '', timeline: '' });
        alert('Project added!');
        window.location.reload(); // reload to fetch new project
      }
    } catch (error) {
      alert(`Error creating project: ${error.message}`);
    }
  };

  // Add team member to Firestore
  const handleAddToTeam = async () => {
    if (!selectedProject?.docId || !teamData.user || !teamData.task || !teamData.count) return;
    try {
      const projRef = doc(db, 'projects', selectedProject.docId);
      await updateDoc(projRef, {
        team: arrayUnion({ ...teamData })
      });
      setTeamData({ user: '', task: '', count: '' });
      alert('Team member added!');
      window.location.reload();
    } catch (error) {
      alert(`Error adding to team: ${error.message}`);
    }
  };

  // Delete project from Firestore
  const handleProjectDelete = async (id) => {
    try {
      const proj = projects.find(p => p.project_id === id);
      if (proj?.docId) {
        await deleteDoc(doc(db, 'projects', proj.docId));
        alert('Project deleted!');
        setProjects(projects.filter((p) => p.project_id !== id));
        if (selectedProject?.project_id === id) setSelectedProject(null);
      }
    } catch (error) {
      alert(`Error deleting project: ${error.message}`);
    }
  };

  // Update project details
  const handleProjectUpdate = async () => {
    try {
      if (!selectedProject?.docId) return;
      const projRef = doc(db, 'projects', selectedProject.docId);
      await updateDoc(projRef, {
        name: selectedProject.name,
        project_id: selectedProject.project_id,
        timeline: selectedProject.timeline,
      });
      alert('Project updated!');
      window.location.reload();
    } catch (error) {
      alert(`Error updating project: ${error.message}`);
    }
  };

  // Delete a team member (remove from Firestore array)
  const handleTaskDelete = async (index) => {
    if (!selectedProject?.docId) return;
    try {
      const projRef = doc(db, 'projects', selectedProject.docId);
      const updatedTeam = [...selectedProject.team];
      updatedTeam.splice(index, 1);
      await updateDoc(projRef, { team: updatedTeam });
      setSelectedProject({ ...selectedProject, team: updatedTeam });
      alert('Team member removed!');
    } catch (error) {
      alert(`Error removing member: ${error.message}`);
    }
  };

  const countTeamInsights = () => {
    return projects.map((proj) => ({
      name: proj.name,
      members: proj.team ? proj.team.length : 0,
    }));
  };

  return (
    <div className="manager-container">
      <h1 className="header">Manager Dashboard</h1>

      <div className="section">
        <h2>+ Add Project</h2>
        <div className="project-form">
          <input placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input placeholder="Project ID" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} />
          <input placeholder="Timeline (e.g. 1 week)" value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} />
          <button onClick={handleProjectCreate}>Create</button>
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
                <strong>{proj.name}</strong> | ID: {proj.project_id} | Timeline: {proj.timeline}
              </div>
              <button onClick={() => handleProjectDelete(proj.project_id)} style={{ marginLeft: '10px' }}>Delete</button>
            </div>
          ))
        )}
      </div>

      {selectedProject && (
        <div className="section">
          <h2>Manage Team for: {selectedProject.name}</h2>
          <div className="project-edit-form">
            <input value={selectedProject.name} onChange={(e) => setSelectedProject({ ...selectedProject, name: e.target.value })} />
            <input value={selectedProject.project_id} onChange={(e) => setSelectedProject({ ...selectedProject, project_id: e.target.value })} />
            <input value={selectedProject.timeline} onChange={(e) => setSelectedProject({ ...selectedProject, timeline: e.target.value })} />
            <button onClick={handleProjectUpdate}>Update Project</button>
          </div>

          <div className="team-form">
            <select value={teamData.user} onChange={(e) => setTeamData({ ...teamData, user: e.target.value })}>
              <option value="">Select User</option>
              {usersFromSuperUser.map((user, i) => (
                <option key={i} value={user}>{user}</option>
              ))}
            </select>
            <input placeholder="Task Name" value={teamData.task} onChange={(e) => setTeamData({ ...teamData, task: e.target.value })} />
            <input placeholder="Task Count" value={teamData.count} onChange={(e) => setTeamData({ ...teamData, count: e.target.value })} />
            <button onClick={handleAddToTeam}>Add to Team</button>
          </div>

          <div className="team-list">
            {!selectedProject.team || selectedProject.team.length === 0 ? (
              <p>No members in this project yet.</p>
            ) : (
              selectedProject.team.map((member, i) => (
                <div key={i}>
                  {member.user} - {member.task} ({member.count})
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
            <p key={i}>
              {p.name} - {p.members} Members
            </p>
          ))
        )}
      </div>

      <div className="section">
        <h2>Performance Analysis</h2>
        <p>Most tasks completed by: Sara (12)</p>
      </div>
    </div>
  );
};

export default Manager;

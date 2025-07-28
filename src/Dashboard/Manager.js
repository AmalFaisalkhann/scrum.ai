import React, { useState, useEffect } from 'react';
import '../App.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db, auth } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
  const [teamData, setTeamData] = useState({ user: '', task: '', count: '', role: 'Developer' });

  // Load projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      console.log('Fetching projects...'); // Debug log
      console.log('Current user:', auth.currentUser); // Debug log
      
      if (!auth.currentUser) {
        console.log('No current user found'); // Debug log
        return;
      }
      
      console.log('User ID:', auth.currentUser.uid); // Debug log
      
      try {
        // Fetch projects from the main projects collection
        console.log('Fetching from main projects collection...'); // Debug log
        const q = query(collection(db, 'projects'), where('created_by', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        console.log('Main projects query result:', querySnapshot.docs.length, 'documents'); // Debug log
        
        const projectList = querySnapshot.docs.map(docSnap => ({ 
          ...docSnap.data(), 
          docId: docSnap.id, 
          project_id: docSnap.id,
          source: 'main' 
        }));

        // Also fetch projects from workspace subcollections
        console.log('Fetching from workspace subcollections...'); // Debug log
        const workspacesQuery = query(collection(db, 'workspaces'), where('created_by', '==', auth.currentUser.uid));
        const workspacesSnapshot = await getDocs(workspacesQuery);
        console.log('Workspaces found:', workspacesSnapshot.docs.length); // Debug log
        
        for (const workspaceDoc of workspacesSnapshot.docs) {
          const workspaceId = workspaceDoc.id;
          console.log('Checking workspace:', workspaceId); // Debug log
          const projectsQuery = query(collection(db, `workspaces/${workspaceId}/projects`));
          const projectsSnapshot = await getDocs(projectsQuery);
          console.log('Projects in workspace', workspaceId, ':', projectsSnapshot.docs.length); // Debug log
          
          const workspaceProjects = projectsSnapshot.docs.map(docSnap => ({
            ...docSnap.data(),
            docId: docSnap.id,
            project_id: docSnap.id,
            workspaceId: workspaceId,
            workspaceName: workspaceDoc.data().name,
            source: 'workspace'
          }));
          
          projectList.push(...workspaceProjects);
        }

        console.log('Total projects found:', projectList.length); // Debug log
        console.log('Fetched projects:', projectList); // Debug log
        setProjects(projectList);
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert(`Error fetching projects: ${error.message}`);
      }
    };

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user); // Debug log
      if (user) {
        fetchProjects();
      } else {
        setProjects([]);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Create project in Firestore
  const handleProjectCreate = async () => {
    try {
      if (formData.name && formData.id && formData.timeline) {
        const docRef = await addDoc(collection(db, 'projects'), {
          name: formData.name,
          description: formData.name, // Use name as description for now
          timeline: formData.timeline,
          created_by: auth.currentUser.uid,
          team: [],
          created_at: new Date(),
        });
        // Set project_id to Firestore doc id
        await updateDoc(docRef, { project_id: docRef.id });
        console.log('Project created with ID:', docRef.id); // Debug log
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
      let projRef;
      if (selectedProject.source === 'workspace') {
        // Add to workspace subcollection project
        projRef = doc(db, `workspaces/${selectedProject.workspaceId}/projects`, selectedProject.docId);
      } else {
        // Add to main projects collection
        projRef = doc(db, 'projects', selectedProject.docId);
      }
      
      await updateDoc(projRef, {
        team: arrayUnion({ ...teamData, role: teamData.role || 'Developer' })
      });
      setTeamData({ user: '', task: '', count: '', role: 'Developer' });
      alert('Team member added!');
      window.location.reload();
    } catch (error) {
      alert(`Error adding to team: ${error.message}`);
    }
  };

  // Delete project from Firestore
  const handleProjectDelete = async (id) => {
    try {
      const proj = projects.find(p => p.docId === id);
      if (proj?.docId) {
        if (proj.source === 'workspace') {
          // Delete from workspace subcollection
          await deleteDoc(doc(db, `workspaces/${proj.workspaceId}/projects`, proj.docId));
        } else {
          // Delete from main projects collection
          await deleteDoc(doc(db, 'projects', proj.docId));
        }
        alert('Project deleted!');
        setProjects(projects.filter((p) => p.docId !== id));
        if (selectedProject?.docId === id) setSelectedProject(null);
      }
    } catch (error) {
      alert(`Error deleting project: ${error.message}`);
    }
  };

  // Update project details
  const handleProjectUpdate = async () => {
    try {
      if (!selectedProject?.docId) return;
      
      let projRef;
      if (selectedProject.source === 'workspace') {
        // Update in workspace subcollection
        projRef = doc(db, `workspaces/${selectedProject.workspaceId}/projects`, selectedProject.docId);
      } else {
        // Update in main projects collection
        projRef = doc(db, 'projects', selectedProject.docId);
      }
      
      await updateDoc(projRef, {
        name: selectedProject.name,
        description: selectedProject.name, // Keep description in sync
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
      let projRef;
      if (selectedProject.source === 'workspace') {
        // Update in workspace subcollection
        projRef = doc(db, `workspaces/${selectedProject.workspaceId}/projects`, selectedProject.docId);
      } else {
        // Update in main projects collection
        projRef = doc(db, 'projects', selectedProject.docId);
      }
      
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
      
      {/* Debug information */}
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
        <h3>Debug Info:</h3>
        <p><strong>Current User:</strong> {auth.currentUser ? auth.currentUser.email : 'Not logged in'}</p>
        <p><strong>User ID:</strong> {auth.currentUser ? auth.currentUser.uid : 'N/A'}</p>
        <p><strong>Projects Count:</strong> {projects.length}</p>
        <p><strong>Projects:</strong> {JSON.stringify(projects.map(p => ({ name: p.name, id: p.project_id, source: p.source })))}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '10px' }}>Refresh Page</button>
        <button 
          onClick={async () => {
            try {
              const docRef = await addDoc(collection(db, 'projects'), {
                name: 'Test Project ' + Date.now(),
                description: 'Test project for debugging',
                timeline: '1 week',
                created_by: auth.currentUser.uid,
                team: [],
                created_at: new Date(),
              });
              await updateDoc(docRef, { project_id: docRef.id });
              alert('Test project created with ID: ' + docRef.id);
              window.location.reload();
            } catch (error) {
              alert('Error creating test project: ' + error.message);
            }
          }} 
          style={{ marginTop: '10px', marginLeft: '10px' }}
        >
          Create Test Project
        </button>
      </div>

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
                {proj.source === 'workspace' && proj.workspaceName && (
                  <span style={{ color: '#666', fontSize: '0.9em' }}> | Workspace: {proj.workspaceName}</span>
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
            <select value={teamData.role} onChange={(e) => setTeamData({ ...teamData, role: e.target.value })}>
              <option value="Developer">Developer</option>
              <option value="Product Owner">Product Owner</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Designer">Designer</option>
              <option value="QA">QA</option>
            </select>
            <button onClick={handleAddToTeam}>Add to Team</button>
          </div>

          <div className="team-list">
            {!selectedProject.team || selectedProject.team.length === 0 ? (
              <p>No members in this project yet.</p>
            ) : (
              selectedProject.team.map((member, i) => (
                <div key={i}>
                  {member.user} - {member.task} ({member.count}) [{member.role || 'Developer'}]
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

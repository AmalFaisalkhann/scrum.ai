import React, { useState, useEffect } from "react";
import { createProjectInWorkspace, getWorkspaceUsers } from "../AddProjectinWorkspace";
import { auth } from "../firebase";
import "./CreateProject.css";

const CreateProject = ({ workspaceId, onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [workspaceId]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await getWorkspaceUsers(workspaceId);
      setAvailableUsers(users);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeveloperToggle = (developer) => {
    setSelectedDevelopers(prev => {
      const isSelected = prev.find(d => d.id === developer.id);
      if (isSelected) {
        return prev.filter(d => d.id !== developer.id);
      } else {
        return [...prev, developer];
      }
    });
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    if (selectedDevelopers.length === 0) {
      alert("Please select at least one developer.");
      return;
    }

    console.log("Creating project with data:", {
      workspaceId,
      projectName,
      projectDescription,
      selectedDevelopers
    });

    setLoading(true);
    try {
      const projectData = {
        name: projectName,
        description: projectDescription,
        selectedDevelopers: selectedDevelopers,
        teamId: `team_${Date.now()}` // Generate a unique team ID
      };

      console.log("Calling createProjectInWorkspace with:", projectData);
      const projectId = await createProjectInWorkspace(workspaceId, projectData);
      
      console.log("Project created successfully with ID:", projectId);
      alert(`Project created successfully! Project ID: ${projectId}`);
      
      // Reset form
      setProjectName("");
      setProjectDescription("");
      setSelectedDevelopers([]);
      
      // Notify parent component
      if (onProjectCreated) {
        onProjectCreated(projectId);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUsers) {
    return <div className="create-project-container">Loading users...</div>;
  }

  return (
    <div className="create-project-container">
      <h2 className="page-title">Create New Project</h2>
      
      <div className="project-form">
        <div className="form-group">
          <label htmlFor="projectName">Project Name *</label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectDescription">Project Description</label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Describe your project..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Select Developers *</label>
          <div className="developers-list">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                className={`developer-item ${
                  selectedDevelopers.find(d => d.id === user.id) ? 'selected' : ''
                }`}
                onClick={() => handleDeveloperToggle(user)}
              >
                <div className="developer-info">
                  <div className="developer-name">{user.name}</div>
                  <div className="developer-email">{user.email}</div>
                  <div className="developer-role">{user.role}</div>
                </div>
                <div className="developer-checkbox">
                  {selectedDevelopers.find(d => d.id === user.id) && (
                    <span className="checkmark">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="selected-count">
            {selectedDevelopers.length} developer(s) selected
          </div>
        </div>

        <button 
          onClick={handleCreateProject} 
          disabled={loading || selectedDevelopers.length === 0}
          className="create-button"
        >
          {loading ? "Creating Project..." : "Create Project"}
        </button>
      </div>
    </div>
  );
};

export default CreateProject; 
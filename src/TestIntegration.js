import React, { useState } from "react";
import { registerUser, createWorkspace, createProjectInWorkspace } from "./firebaseActions";

const TestIntegration = () => {
  const [userId, setUserId] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);

  const handleRegister = async () => {
    const uid = await registerUser("pm" + Date.now() + "@example.com", "test1234", "Project Manager", "PM");
    setUserId(uid);
    alert(`User registered with UID: ${uid}`);
  };

  const handleCreateWorkspace = async () => {
    if (!userId) return alert("Register a user first!");
    const wsId = await createWorkspace("Frontend Workspace", userId);
    setWorkspaceId(wsId);
    alert(`Workspace created with ID: ${wsId}`);
  };

  const handleCreateProject = async () => {
    if (!workspaceId) return alert("Create a workspace first!");
    const projectId = await createProjectInWorkspace(workspaceId, "Frontend Project");
    alert(`Project created with ID: ${projectId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Firebase Test Integration</h1>
      <button onClick={handleRegister}>Register User</button>
      <button onClick={handleCreateWorkspace}>Create Workspace</button>
      <button onClick={handleCreateProject}>Create Project</button>
    </div>
  );
};

export default TestIntegration;

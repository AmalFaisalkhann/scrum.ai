import React, { useState } from "react";
import { createWorkspace } from "../services/firebaseActions";
import { auth } from "../firebase";
import "./Workspace.css"; // Keep existing styles or update as needed

const Workspace = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      alert("Please enter a workspace name.");
      return;
    }
    setLoading(true);
    try {
      const wsId = await createWorkspace(workspaceName, auth.currentUser.uid);
      alert(`Workspace created: ${wsId}`);
      setWorkspaceName(""); // Clear input after creation
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-container">
      <h1 className="page-title">Create Workspace</h1>
      <div className="workspace-setup">
        <input
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          placeholder="Workspace name"
        />
        <button onClick={handleCreateWorkspace} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default Workspace;

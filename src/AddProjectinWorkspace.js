import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "./firebase";

// Get all users from the workspace
export const getWorkspaceUsers = async (workspaceId) => {
  try {
    // Get all users in the system (you might want to filter by workspace membership)
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        user_id: userData.user_id
      });
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Create project with selected developers
export const createProjectInWorkspace = async (workspaceId, projectData) => {
  const {
    name,
    description,
    selectedDevelopers, // Array of developer objects with id, name, email, role
    teamId
  } = projectData;

  try {
    // Create the project in the main projects collection (not under workspace)
    const projectRef = await addDoc(collection(db, "projects"), {
      name: name,
      description: description,
      team_id: teamId,
      state: "new", // Initialize with "new" state to trigger the backend listener
      created_at: new Date(),
      created_by: auth.currentUser?.uid, // Add the creator's user ID
      workspace_id: workspaceId, // Store the workspace ID for reference
      developers: selectedDevelopers // Store the selected developers
    });

    const projectId = projectRef.id;

    // Create developer profiles in the project sub-collection
    for (const developer of selectedDevelopers) {
      await addDoc(collection(db, `projects/${projectId}/dev_profiles`), {
        id: developer.id,
        name: developer.name,
        email: developer.email,
        role: developer.role,
        user_id: developer.user_id,
        tech: developer.tech || [], // Default empty array for tech skills
        experience_years: developer.experience_years || 1, // Default 1 year
        created_at: new Date()
      });
    }

    console.log(`Project created successfully with ID: ${projectId}`);
    return projectId;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

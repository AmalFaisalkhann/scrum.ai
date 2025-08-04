import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createProjectInWorkspace = async (workspaceId, projectName, teamId) => {
  const projectRef = await addDoc(collection(db, `workspaces/${workspaceId}/projects`), {
    name: projectName,
    team_id: teamId,
    state: "new", // Initialize with "new" state
    created_at: new Date()
  });
  return projectRef.id;
};

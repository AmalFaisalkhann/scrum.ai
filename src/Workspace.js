import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createWorkspace = async (workspaceName, userId) => {
  const workspaceRef = await addDoc(collection(db, "workspaces"), {
    name: workspaceName,
    created_by: userId,
    created_at: new Date()
  });
  return workspaceRef.id;
};

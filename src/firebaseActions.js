import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const registerUser = async (email, password, name, role) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await setDoc(doc(db, "users", user.uid), {
    user_id: user.uid,
    name,
    email,
    role, 
    created_at: new Date(),
  });
  return user.uid;
};

export const createWorkspace = async (workspaceName, userId) => {
  const workspaceRef = await addDoc(collection(db, "workspaces"), {
    name: workspaceName,
    created_by: userId,
    created_at: new Date(),
  });
  return workspaceRef.id;
};

export const createProjectInWorkspace = async (workspaceId, projectName) => {
  const projectRef = await addDoc(collection(db, `workspaces/${workspaceId}/projects`), {
    name: projectName,
    state: "new", // Initialize with "new" state
    created_at: new Date(),
  });
  return projectRef.id;
};

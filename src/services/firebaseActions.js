import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Register a user
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
  return user;
};

// Login user
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Forgot Password
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
  return true;
};

// Create Workspace
export const createWorkspace = async (workspaceName, userId) => {
  const workspaceRef = await addDoc(collection(db, "workspaces"), {
    name: workspaceName,
    created_by: userId,
    created_at: new Date(),
  });
  return workspaceRef.id;
};

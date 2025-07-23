import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const snapshot = await getDocs(collection(db, "workspaces"));
      setWorkspaces(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchWorkspaces();
  }, []);

  return (
    <div>
      <h1>Your Workspaces</h1>
      {workspaces.map(ws => (
        <div key={ws.id}>
          <h2>{ws.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;

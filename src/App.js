
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import ForgotPassword from './Auth/ForgotPassword';
import Userroles from './Userroles/Userroles';
import Productowner from './Dashboard/Productowner';
import Workspace from './Dashboard/Workspace';
import EnterWorkspace from './Dashboard/EnterWorkspace';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Userroles />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/ForgotPassward" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/Productowner" element={<Productowner />} />
            <Route path="Workspace" element={<Workspace />} />
<Route path="/EnterWorkspace" element={<EnterWorkspace />} />



    </Routes>
  );
}

export default App;

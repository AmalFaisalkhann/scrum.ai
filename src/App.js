// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Dashboard/LandingPage';
import Workspace from './Dashboard/Workspace';
import EnterWorkspace from './Dashboard/EnterWorkspace';
import Manager from './Dashboard/Manager';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import ForgotPassword from './Auth/ForgotPassword';
import Productowner from './Dashboard/Productowner';
import Developer from './Dashboard/Developer';
import SuperUserScreen from './Dashboard/SuperUserScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/enter-workspace" element={<EnterWorkspace />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Productowner" element={<Productowner />} /> {/* ✅ Added route */}
                <Route path="/Developer" element={<Developer />} /> {/* ✅ Added route */}
                <Route path="/SuperUserScreen" element={<SuperUserScreen/>} /> {/* ✅ Added route */}

      </Routes>
    </Router>
  );
}

export default App;

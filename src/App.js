// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Developer from './pages/Developer';
import Manager from './pages/Manager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/developer" element={<Developer />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="*" element={<Navigate to="/developer" />} />
      </Routes>
    </Router>
  );
}

export default App;

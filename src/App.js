import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusinessCard from './view/BusinessCard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Base route */}
        <Route path="/" element={<BusinessCard />} />
        {/* Specific user route */}
        <Route path="/:companycode/:username" element={<BusinessCard />} />
        {/* Default route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
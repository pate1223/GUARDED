import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from '/GuardED/guarded/Guarded-homepage/src '; 

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/table" element={<div className="p-8 text-center text-gray-500">Table View - Coming Soon</div>} />
          <Route path="/taxonomy" element={<div className="p-8 text-center text-gray-500">Job Performers Taxonomy - Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectView from './components/ProjectView';

import projects from './data';
import ProjectTable from './components/ProjectTable';

import './App.css';

import SignUpForm from './components/SignUpForm';

const App = () => {
  return (
    
  
    <Router>
      <div className="App">
        {/* <main> */}
          <Routes>            
            <Route path="/projects" element={<ProjectTable projects={projects} />} />
            <Route path="/" element={<SignUpForm /> } />
            <Route path="/projectView/:projectId" element={<ProjectView  /> } />
          </Routes>
        {/* </main> */}
        
      </div>
    </Router>
  );
};

export default App;
// src/ProjectTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProjectTable.css'; 
import './Header.css';
import './Footer.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleViewClick = (projectId) => {  
    console.log(`View details for project ID: ${projectId}`);      
    navigate(`/projectView/${projectId}`);
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:2222/project/getProjects');
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.response ? error.response.data.message : error.message}</p>;
  }

  return (
    <div>
      <Header />
      <table className="project-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Budget</th>
            <th>Description</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>{project.budget}</td>
              <td>{project.description}</td>
              <td>{project.status}</td>
              <td>{new Date(project.startDate).toLocaleDateString()}</td>
              <td>{new Date(project.endDate).toLocaleDateString()}</td>
              <td><button onClick={() => handleViewClick(project._id)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  );
};



export default ProjectTable;

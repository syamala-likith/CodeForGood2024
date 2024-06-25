
import React, { useState } from 'react';
import './SignUpForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectTable from './ProjectTable';

// import Cookies from 'js-cookie';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:2222/user/userLogin', {
      email: email,
      password: password
    })
    .then((response) => {
      if (response.data.status === true) {
        // Cookies.set('isLogedIn', 'true', { expires: 1 });
       // alert(response.data.message);
        
         navigate('/projects');
      } else {
        // Cookies.remove('isLogedIn');
        alert(response.data.message);
      }
    })
    .catch((error) => {
      alert(error);
      console.log(error);
    });
  };

  return (
    <div className='main-class'>
    <div className="left-pane">
             <img src="src/assets/image.png" alt="Graduation" />

      </div>
    <div className="right-pane">      
    <div className="sign-up-form">
      <img src="src/assets/cry.jpg" alt="Logo" />
      <h1>Child Rights & You</h1>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Next</button>
      </form>
      {message && <p>{message}</p>}
      
    </div>
    </div>
    </div>
  );
}

export default SignUpForm;
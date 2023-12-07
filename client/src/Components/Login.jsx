import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './LoginSignup.css';

import user_icon from './Assets/person.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';

const Login = () => {
  const [action, setAction] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <p>Superhero Status is here to provide the information on all heroes</p>
      <div className='container'>
        
        <div className='header'>
          <div className='text'>{action}</div>
          <div className='underline'></div>
        </div>
        <div className="inputs">
          {action==="Login"?<div></div>:<div className="input">
         <img src={user_icon} alt=""/> 
         <input type ="text" placeholder="Name"/>
        </div>}
        <div className="input">
        <img src={email_icon} alt=""/>
        <input 
          type="email" 
          placeholder="Email Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input">
        <img src={password_icon} alt=""/>
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {/* ... (rest of your HTML structure) */}
      <div className="submit-container">
        <div 
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={action === "Login" ? signIn : () => { /* Sign Up Logic Here */ }}>
          {action}
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Login
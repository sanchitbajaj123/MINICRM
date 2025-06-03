import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './login.css';

const Login = () => {
  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Logged in user:', decoded);
    alert(`Welcome, ${decoded.name}`);
    window.location.href = '/dashboard'; 
   
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p className="subtitle">Sign in with Google to access your dashboard</p>
        <div className="google-btn">
          <center>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log('Login Failed')}
            theme="outline"
            size="large"
            
          />
          </center>
        </div>
      </div>
    </div>
  );
};

export default Login;

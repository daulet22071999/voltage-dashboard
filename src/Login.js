import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import "./Login.css"
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function hashEmail(email) {
    return CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (!auth) {
        }else{
          navigate('/');
        }
      }, []);

  const handleLogin = async () => {
    const hashedEmail = hashEmail(email);
    console.log(hashedEmail);
    try {
      const userRef = ref(db, `users/${hashedEmail}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
            localStorage.setItem("auth", email)
          navigate("/");
        } else {
          toast.error('Incorrect password.');
        }
      } else {
        toast.error('User not found.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed. Try again.');
    }
  };
  

  return (
    <div className='login-main-parent'>
      <h1 className='login-main-header'>Login</h1>
      <div className='login-body'>
        <input
            className='login-input-email'
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            className='login-input-password'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button 
            className='login-button-enter'
            onClick={handleLogin}>Login</button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Login;

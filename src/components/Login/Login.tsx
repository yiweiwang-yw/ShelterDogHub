import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../../api/auth';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginUser(name, email);
      history.push('/dog-search'); // Redirect to the Dog Search page
    } catch (error) {
      console.error('Login failed:', error);
      // Optionally, set an error state here to show a user-friendly message.
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/login', { username, password });
      const { token, user } = response.data;

      // Store the token in localStorage or a state variable
      localStorage.setItem('token', token);

      // Call the onLogin callback with user data
      onLogin(user);

      // Clear the form fields and error
      setUsername('');
      setPassword('');
      setError(null);
    } catch (error) {
      // Handle login error
      setError('Login failed. Please check your credentials.');
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginForm;
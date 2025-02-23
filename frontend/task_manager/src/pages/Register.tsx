import React, { useState } from 'react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Registration failed');
        return;
      }
      // If success, maybe notify user
      alert('Registration successful! You can now log in.');
    } catch (error) {
      console.error(error);
      alert('Server error during registration');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username: </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
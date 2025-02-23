import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

function App() {
  // State to track if user is logged in + store the token
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <nav style={{ marginBottom: '1rem' }}>
        {token ? (
          <>
            <Link to="/tasks">Tasks</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        {/* Show tasks if logged in, else show login */}
        <Route
          path="/tasks"
          element={
            token ? <Tasks token={token} /> : <div>Please log in first</div>
          }
        />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
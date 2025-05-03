import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { useToast } from './useToast';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, showToast, closeToast] = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8000/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.key) {
        showToast('Login successful!', 'success');
        if (onLoginSuccess) onLoginSuccess(data.key);
        navigate('/');
      } else {
        setError(data.detail || data.non_field_errors || 'Login failed');
      }
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', padding: 24, borderRadius: 10, boxShadow: '0 2px 16px #0001' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%', marginTop: 10 }}>Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
    </div>
  );
}

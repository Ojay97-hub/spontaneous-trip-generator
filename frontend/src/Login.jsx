import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { useToast } from './useToast';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, showToast, closeToast] = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      showToast('Login successful!', 'success');
      if (onLoginSuccess) onLoginSuccess(token);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', padding: 24, borderRadius: 10, boxShadow: '0 2px 16px #0001' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
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

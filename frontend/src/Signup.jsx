import { useState } from 'react';

export default function Signup({ onSignupSuccess }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password1 !== password2) {
      setError("Passwords do not match");
      return;
    }
    const res = await fetch('http://localhost:8000/auth/registration/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password1, password2 })
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Account created! Please check your email to verify.");
      if (onSignupSuccess) onSignupSuccess();
    } else {
      setError(data.detail || data.email || data.username || data.password1 || data.password2 || "Sign up failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", background: "#fff", padding: 24, borderRadius: 10, boxShadow: "0 2px 16px #0001" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required style={{ width: "100%", marginBottom: 10 }} />
        <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" required style={{ width: "100%", marginBottom: 10 }} />
        <input value={password1} onChange={e => setPassword1(e.target.value)} type="password" placeholder="Password" required style={{ width: "100%", marginBottom: 10 }} />
        <input value={password2} onChange={e => setPassword2(e.target.value)} type="password" placeholder="Confirm Password" required style={{ width: "100%", marginBottom: 10 }} />
        <button type="submit" style={{ width: "100%", marginTop: 10 }}>Sign Up</button>
      </form>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
    </div>
  );
}

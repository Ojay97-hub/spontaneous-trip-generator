import { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function Signup({ onSignupSuccess }) {
  const [email, setEmail] = useState('');
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
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password1);
      await sendEmailVerification(userCredential.user);
      const token = await userCredential.user.getIdToken();
      setSuccess("Account created! Verification email sent.");
      if (onSignupSuccess) onSignupSuccess(token);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", background: "#fff", padding: 24, borderRadius: 10, boxShadow: "0 2px 16px #0001" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required style={{ width: "100%", marginBottom: 10 }} />
        <input value={password1} onChange={e => setPassword1(e.target.value)} type="password" placeholder="Password" required style={{ width: "100%", marginBottom: 10 }} />
        <input value={password2} onChange={e => setPassword2(e.target.value)} type="password" placeholder="Confirm Password" required style={{ width: "100%", marginBottom: 10 }} />
        <button type="submit" style={{ width: "100%", marginTop: 10 }}>Sign Up</button>
      </form>
      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
    </div>
  );
}

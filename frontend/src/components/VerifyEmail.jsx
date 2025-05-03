import { useEffect, useState } from 'react';

// This component is now only for displaying a message after Firebase verification
const VerifyEmail = () => {
  // Remove toast and related logic for a smoother UX
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    // Firebase handles verification via email link
    setStatus('success');
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0001', padding: 40, minWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {status === 'pending' && <div style={{ fontSize: 38, marginBottom: 12 }}>⏳</div>}
        {status === 'success' && <div style={{ fontSize: 52, color: '#22c55e', marginBottom: 12 }}>✅</div>}
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Email Verification</h2>
        <div style={{ fontSize: 18, color: '#666', margin: '16px 0', textAlign: 'center' }}>
          Please check your email and click the verification link.<br />
          Once verified, you may log in.<br />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

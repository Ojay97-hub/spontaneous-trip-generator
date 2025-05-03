import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { useToast } from './useToast';

const VerifyEmail = () => {
  const [status, setStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [user, setUser] = useState(null);
  const [toast, showToast, closeToast] = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    
    if (!key) {
      setStatus('error');
      showToast('Invalid verification link.', 'error');
      return;
    }
    
    // First verify the email
    fetch('http://localhost:8000/auth/registration/verify-email/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
      credentials: 'include',
    })
      .then(async (response) => {
        const data = await response.json();
        
        if (response.ok) {
          // Email verification successful
          setStatus('success');
          
          // Now try to get user info or log in
          try {
            const userRes = await fetch('http://localhost:8000/api/me/', { 
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (userRes.ok) {
              const userData = await userRes.json();
              if (userData.username) {
                setUser(userData);
                localStorage.removeItem('pendingVerification');
                showToast('Email verified! You are now logged in.', 'success');
                // Redirect after a short delay
                setTimeout(() => navigate('/', { 
                  state: { notification: 'Email verified! Welcome, ' + userData.username + '.' } 
                }), 3000);
              } else {
                // User data returned but no username - try to login
                showToast('Email verified! Please log in.', 'success');
                setTimeout(() => navigate('/', { 
                  state: { notification: 'Email verified! Please log in.' } 
                }), 3000);
              }
            } else {
              // No valid user session - redirect to login
              setStatus('success');
              showToast('Email verified! Please log in.', 'success');
              setTimeout(() => navigate('/', { 
                state: { notification: 'Email verified! Please log in.' } 
              }), 3000);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setStatus('success');
            showToast('Email verified! Please log in.', 'success');
            setTimeout(() => navigate('/', { 
              state: { notification: 'Email verified! Please log in.' } 
            }), 3000);
          }
        } else {
          // Email verification failed
          setStatus('error');
          showToast(data.detail || 'Verification failed. Please try again or contact support.', 'error');
        }
      })
      .catch((error) => {
        console.error('Verification error:', error);
        setStatus('error');
        showToast('Verification failed. Please try again or contact support.', 'error');
      });
  }, [navigate, showToast]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0001', padding: 40, minWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {status === 'pending' && <div style={{ fontSize: 38, marginBottom: 12 }}>⏳</div>}
        {status === 'success' && <div style={{ fontSize: 52, color: '#22c55e', marginBottom: 12 }}>✅</div>}
        {status === 'error' && <div style={{ fontSize: 52, color: '#ef4444', marginBottom: 12 }}>❌</div>}
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Email Verification</h2>
        {status === 'pending' && <div style={{ fontSize: 18, color: '#666', margin: '16px 0' }}>Verifying your email...</div>}
        {status === 'success' && (
          <>
            <div style={{ fontSize: 18, color: '#22c55e', margin: '16px 0', textAlign: 'center' }}>
              Email verified!<br />
              {user ? (
                <>
                  You are now logged in as <b>{user.username}</b>.<br />
                  <a href="/profile" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600, fontSize: 17 }}>Go to your Profile</a>
                </>
              ) : (
                'Please log in to access your account.'
              )}
              <br />Redirecting to the homepage...
            </div>
          </>
        )}
        {status === 'error' && <div style={{ fontSize: 17, color: '#ef4444', margin: '16px 0' }}>Verification failed. Please try again or contact support.</div>}
      </div>
    </div>
  );
};

export default VerifyEmail;

// Helper to verify email and auto-login
export async function verifyEmailAndLogin(key) {
  const verifyRes = await fetch('http://localhost:8000/auth/registration/account-confirm-email/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });
  let verifyData;
  try {
    verifyData = await verifyRes.json();
  } catch (e) {
    const text = await verifyRes.text();
    throw new Error('Server returned an error: ' + text.slice(0, 200));
  }
  if (verifyData.detail !== 'ok') {
    throw new Error(verifyData.detail || 'Email verification failed');
  }
  // Try to fetch user info (if session/cookie auth enabled)
  const meRes = await fetch('http://localhost:8000/api/me/', { credentials: 'include' });
  let userData;
  try {
    userData = await meRes.json();
  } catch (e) {
    const text = await meRes.text();
    throw new Error('Server returned an error: ' + text.slice(0, 200));
  }
  if (!userData.username) {
    throw new Error('Could not auto-login after verification.');
  }
  return userData;
}

import React, { useEffect, useState } from 'react';

const Profile = ({ user }) => {
  const [savedLocations, setSavedLocations] = useState(null);
  useEffect(() => {
    if (user) {
      // Fetch saved locations for the user
      fetch('http://localhost:8000/api/me/saved-locations/', { credentials: 'include' })
        .then(res => res.ok ? res.json() : [])
        .then(data => setSavedLocations(data.locations || []))
        .catch(() => setSavedLocations([]));
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ marginTop: 80, textAlign: 'center', fontSize: 22, color: '#666' }}>
        You must be logged in to view your profile.
      </div>
    );
  }
  return (
    <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0001', padding: 40, minWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>👤</div>
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Your Profile</h2>
        <div style={{ fontSize: 18, color: '#2563eb', margin: '12px 0' }}><b>Username:</b> {user.username}</div>
        <div style={{ fontSize: 18, color: '#2563eb', margin: '12px 0' }}><b>Email:</b> {user.email}</div>
        <div style={{ fontSize: 22, fontWeight: 700, margin: '20px 0 10px 0', color: '#222' }}>Your Saved Locations</div>
        {savedLocations === null ? (
          <div style={{ fontSize: 16, color: '#888', margin: '12px 0' }}>Loading...</div>
        ) : savedLocations.length === 0 ? (
          <div style={{ fontSize: 17, color: '#ef4444', margin: '12px 0' }}>You don't have any saved locations. Go get some!</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
            {savedLocations.map((loc, i) => (
              <li key={i} style={{ background: '#f1f5f9', borderRadius: 8, padding: 12, margin: '8px 0', color: '#222' }}>{loc}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;

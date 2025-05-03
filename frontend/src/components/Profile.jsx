import React, { useEffect, useState } from 'react';

const Profile = ({ user }) => {
  // Placeholder for user locations - expects user.selectedLocations or user.locations array
  const locations = user && (user.selectedLocations || user.locations || []);

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
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Welcome, {user.username}!</h2>
        {/* Locations Section */}
        <div style={{ marginTop: 24, width: '100%', textAlign: 'left' }}>
          <h3 style={{ fontWeight: 600, fontSize: 22, marginBottom: 10 }}>Your Selected Locations</h3>
          {locations.length === 0 ? (
            <div style={{ color: '#888', fontSize: 17 }}>No locations saved yet.</div>
          ) : (
            <ul style={{ paddingLeft: 24, marginBottom: 0 }}>
              {locations.map((loc, i) => (
                <li key={i} style={{ fontSize: 17, marginBottom: 4 }}>📍 {loc}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

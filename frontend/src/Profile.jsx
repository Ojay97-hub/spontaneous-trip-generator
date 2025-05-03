import React, { useEffect, useState } from 'react';

const Profile = ({ user }) => {
  if (!user) {
    return (
      <div style={{ marginTop: 80, textAlign: 'center', fontSize: 22, color: '#666' }}>
        You must be logged in to view your profile.
      </div>
    );
  }
  // Show only welcome message when logged in
  return (
    <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0001', padding: 40, minWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>👤</div>
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Welcome, {user.username}!</h2>
      </div>
    </div>
  );
};

export default Profile;

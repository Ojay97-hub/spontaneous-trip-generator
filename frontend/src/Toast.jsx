import React from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      background: type === 'success' ? '#22c55e' : '#ef4444',
      color: '#fff',
      padding: '18px 32px',
      borderRadius: 12,
      boxShadow: '0 4px 24px #0002',
      fontWeight: 600,
      fontSize: 18,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      minWidth: 260,
      animation: 'fade-in 0.5s',
    }}>
      <span style={{ fontSize: 22 }}>
        {type === 'success' ? '✔️' : '❌'}
      </span>
      <span>{message}</span>
      <button onClick={onClose} style={{
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: 22,
        cursor: 'pointer',
        fontWeight: 700,
      }}>×</button>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const dropdownStyles = {
  position: "relative",
  display: "inline-block",
};

const buttonStyles = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "50%",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  cursor: "pointer",
  fontSize: 22,
  transition: "box-shadow 0.2s",
};

const menuStyles = {
  position: "absolute",
  top: 50,
  right: 0,
  minWidth: 180,
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 10,
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  padding: 12,
  zIndex: 1000,
  animation: "fadeIn 0.2s",
};

const menuItemStyles = {
  padding: "10px 16px",
  borderRadius: 6,
  color: "#222",
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "none",
  display: "block",
  transition: "background 0.15s",
};

const menuItemHover = {
  background: "#f3f4f6",
};

const dividerStyles = {
  margin: "8px 0",
  border: 0,
  borderTop: "1px solid #eee",
};

const AccountDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Helper for avatar/initials
  const getAvatar = () => {
    if (user && (user.displayName || user.email)) {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #fca311 60%, #4f46e5 100%)',
          color: '#fff',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 20,
          border: '2.5px solid #fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          transition: 'box-shadow 0.2s',
        }} title={user.displayName || user.email}>
          {(user.displayName ? user.displayName[0] : user.email[0]).toUpperCase()}
        </div>
      );
    }
    return (
      <div style={{
        background: '#fff',
        border: '1.5px solid #ddd',
        borderRadius: '50%',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        fontSize: 22,
        color: '#4f46e5',
        transition: 'box-shadow 0.2s',
      }} title="Account">
        <span role="img" aria-label="account">👤</span>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Firebase logout
  const handleLogout = () => {
    signOut(auth).then(() => {
      setOpen(false);
      navigate('/');
    });
  };

  return (
    <div style={dropdownStyles} ref={dropdownRef}>
      <button
        style={{ border: 'none', background: 'none', padding: 0, outline: 'none', cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
        aria-label={user ? `Account: ${user.displayName || user.email}` : "Account menu"}
        title={user ? user.displayName || user.email : "Account"}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o); }}
      >
        {getAvatar()}
      </button>
      {open && (
        <div style={{
          ...menuStyles,
          background: 'linear-gradient(135deg, #fca311 60%, #4f46e5 100%)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(80,80,180,0.18)',
          border: 'none',
        }}>
          {user ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 16px 12px 16px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.13)',
                boxShadow: '0 2px 8px #fff1',
                marginBottom: 8,
              }}>
                <span style={{ fontSize: 32, marginRight: 6, filter: 'drop-shadow(0 2px 4px #2223)' }} role="img" aria-label="wave">👋</span>
                <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px', color: '#fff', textShadow: '0 1px 6px #4f46e588' }}>
                  Welcome, {user.displayName || user.email}!
                </span>
              </div>
              <hr style={{
                margin: '10px 0',
                border: 0,
                borderTop: '1.5px solid #fff5',
                opacity: 0.5,
              }} />
              <button
                style={{ ...menuItemStyles, color: '#fff', background: 'rgba(255,255,255,0.09)', fontWeight: 600, width: '100%', marginTop: 8 }}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  ...menuItemStyles,
                  ...(hovered === "login" ? menuItemHover : {}),
                  color: '#fff',
                  background: 'rgba(255,255,255,0.09)',
                  fontWeight: 600,
                }}
                onMouseEnter={() => setHovered("login")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                style={{
                  ...menuItemStyles,
                  ...(hovered === "signup" ? menuItemHover : {}),
                  color: '#fff',
                  background: 'rgba(255,255,255,0.09)',
                  fontWeight: 600,
                }}
                onMouseEnter={() => setHovered("signup")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
              <a
                href="#"
                style={{
                  ...menuItemStyles,
                  ...(hovered === "google" ? menuItemHover : {}),
                  color: '#fff',
                  background: 'rgba(255,255,255,0.09)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={() => setHovered("google")}
                onMouseLeave={() => setHovered(null)}
                onClick={e => { e.preventDefault(); setOpen(false); navigate('/login?provider=google'); }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48" style={{ display: 'block' }}><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.46 1.22 8.47 2.81l6.3-6.3C34.7 2.71 29.82 0 24 0 14.82 0 6.84 5.74 2.69 14.09l7.73 6.01C12.21 13.92 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.56-.14-3.07-.4-4.5H24v9h12.39c-.53 2.83-2.13 5.22-4.52 6.84l7.04 5.48C43.87 37.73 46.1 31.62 46.1 24.5z"/><path fill="#FBBC05" d="M10.42 28.1A14.98 14.98 0 0 1 9.5 24c0-1.42.24-2.8.67-4.1l-7.73-6.01A23.93 23.93 0 0 0 0 24c0 3.8.91 7.39 2.52 10.59l7.9-6.49z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.86l-7.04-5.48c-1.96 1.32-4.47 2.11-8.85 2.11-6.38 0-11.79-4.42-13.59-10.41l-7.9 6.49C6.84 42.26 14.82 48 24 48z"/></g></svg>
                Sign in with Google
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;

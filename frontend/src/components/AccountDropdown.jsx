import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;

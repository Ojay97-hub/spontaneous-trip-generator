import React, { useState, useRef, useEffect } from "react";

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

  // Helper for avatar/initials
  const getAvatar = () => {
    if (user && user.username) {
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
        }} title={user.username}>
          {user.username[0].toUpperCase()}
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

  return (
    <div style={dropdownStyles} ref={dropdownRef}>
      <button
        style={{ border: 'none', background: 'none', padding: 0, outline: 'none', cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
        aria-label={user ? `Account: ${user.username}` : "Account menu"}
        title={user ? user.username : "Account"}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o); }}
      >
        {getAvatar()}
      </button>
      {open && (
        <div style={menuStyles}>
          {user ? (
            <>
              <div style={{ padding: "8px 16px", fontWeight: 600, color: "#4f46e5" }}>
                Hi, {user.username}!
              </div>
              <hr style={dividerStyles} />
              <a
                href="http://localhost:8000/accounts/logout/"
                style={{
                  ...menuItemStyles,
                  ...(hovered === "logout" ? menuItemHover : {}),
                }}
                onMouseEnter={() => setHovered("logout")}
                onMouseLeave={() => setHovered(null)}
              >
                Sign Out
              </a>
            </>
          ) : (
            <>
              <a
                href="http://localhost:8000/accounts/login/"
                style={{
                  ...menuItemStyles,
                  ...(hovered === "login" ? menuItemHover : {}),
                }}
                onMouseEnter={() => setHovered("login")}
                onMouseLeave={() => setHovered(null)}
              >
                Sign In
              </a>
              <a
                href="http://localhost:8000/accounts/signup/"
                style={{
                  ...menuItemStyles,
                  ...(hovered === "signup" ? menuItemHover : {}),
                }}
                onMouseEnter={() => setHovered("signup")}
                onMouseLeave={() => setHovered(null)}
              >
                Sign Up
              </a>
              <a
                href="http://localhost:8000/accounts/google/login/"
                style={{
                  ...menuItemStyles,
                  ...(hovered === "google" ? menuItemHover : {}),
                  color: "#ea4335",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onMouseEnter={() => setHovered("google")}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Google G Icon SVG */}
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

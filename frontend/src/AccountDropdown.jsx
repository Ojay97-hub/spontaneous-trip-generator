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
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{ width: 18, height: 18, borderRadius: 3 }} />
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

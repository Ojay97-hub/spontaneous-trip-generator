import React from "react";
import AccountDropdown from "./AccountDropdown";
import { Link } from 'react-router-dom';
import '../Navbar.css';

const Navbar = ({ user, onLogout }) => (
  <nav className="navbar-stg">
    <div className="navbar-left">
      <span className="navbar-title" role="img" aria-label="airplane">✈️</span>
      <span className="navbar-title-text">Spontaneous Trip Generator</span>
    </div>
    <div className="navbar-right">
      {user ? (
        <>
          <Link to="/profile" style={{ marginRight: 16, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Profile</Link>
          <span className="navbar-user-info">Logged in as <b>{user.username || user.email}</b></span>
          <button className="navbar-logout-btn" onClick={onLogout} style={{ marginLeft: 16, padding: '6px 16px', borderRadius: 6, background: '#ef4444', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
        </>
      ) : (
        <span className="navbar-user-info">Not logged in</span>
      )}
      <AccountDropdown user={user} onLogout={onLogout} />
    </div>
  </nav>
);

export default Navbar;

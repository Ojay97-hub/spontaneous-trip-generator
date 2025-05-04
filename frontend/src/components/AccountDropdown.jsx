import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import styles from './AccountDropdown.module.css';

const AccountDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Helper for avatar/initials
  const getAvatar = () => {
    if (user && (user.displayName || user.email)) {
      return (
        <div className={styles.avatar} title={user.displayName || user.email}>
          {(user.displayName ? user.displayName[0] : user.email[0]).toUpperCase()}
        </div>
      );
    }
    return (
      <div className={styles.avatarDefault} title="Account">
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
    <div className={styles.dropdownRoot} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={() => setOpen((o) => !o)}
        aria-label={user ? `Account: ${user.displayName || user.email}` : "Account menu"}
        title={user ? user.displayName || user.email : "Account"}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o); }}
      >
        {getAvatar()}
      </button>
      {open && (
        <div className={styles.dropdownMenu + ' ' + styles.menuGradient}>
          {user ? (
            <>
              <div className={styles.dropdownWelcome}>
                <span className={styles.waveIcon} role="img" aria-label="wave">👋</span>
                <span className={styles.welcomeText}>
                  Welcome, {user.displayName || user.email}!
                </span>
              </div>
              <hr className={styles.divider} />
              <Link
                to="/profile"
                className={styles.menuItem + ' ' + (hovered === 'profile' ? ' ' + styles.menuItemHover : '')}
                onMouseEnter={() => setHovered("profile")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <button
                className={styles.signOutButton + ' ' + styles.menuItem}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={styles.menuItem + (hovered === 'login' ? ' ' + styles.menuItemHover : '')}
                onMouseEnter={() => setHovered("login")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className={styles.menuItem + ' ' + styles.menuSignup + (hovered === 'signup' ? ' ' + styles.menuItemHover : '')}
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

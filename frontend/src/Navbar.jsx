import React from "react";
import AccountDropdown from "./AccountDropdown";
import "./Navbar.css";

const Navbar = ({ user }) => (
  <nav className="navbar-stg">
    <div className="navbar-left">
      <span className="navbar-title" role="img" aria-label="airplane">✈️</span>
      <span className="navbar-title-text">Spontaneous Trip Generator</span>
    </div>
    <div className="navbar-right">
      <AccountDropdown user={user} />
    </div>
  </nav>
);

export default Navbar;

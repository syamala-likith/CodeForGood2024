// src/components/Header.js
import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <img
        src="https://projectheena.com/uploads/ngo/39151731303315/profileImage/images/cry-india.jpg"
        alt=""
        className="logo"
      />
      <nav>
        <ul>
          <li>
            <a href="/">Projects</a>
          </li>
          <li>
            <a href="https://www.cry.org/">About</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

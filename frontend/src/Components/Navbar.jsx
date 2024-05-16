import React from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; // Import the desired icon

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user is logged in (you can use your own logic here)
  const isAuthenticated = localStorage.getItem("Auth Token");

  // Get the first letter of the username to display as the avatar
  const username = localStorage.getItem("userName");
  const avatarLetter = username ? username[0].toUpperCase() : "";

  // Function to handle logout
  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem("Auth Token");
    localStorage.removeItem("userName");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light nav-bg">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src="./image/logo-ps.png"
            alt="ABCmedia"
            style={{ width: "11rem" }}
          />
        </Link>
        
        <ul className="navbar-nav ms-auto">
        
          
          {isAuthenticated ? (
           
            <li className="nav-item">
              <div className="nav-link">
                <div className="d-flex align-items-center">
                  <div className="avatar-badge ">
                    
                    <Button
                      variant="link"
                      className="logout-icon "
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-power-off light-color"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ) : (
           
            <li
              className={`nav-item ${
                location.pathname === "/login" ? "active" : ""
              }`}
            >
              <div className="avatar-badge">
                <Link to="/login" className="nav-link">
                  <i className="fa fa-user icon light-color"></i>
                </Link>
              </div>
            </li>
          )}
        </ul>
        
      </div>
    </nav>
  );
};

export default Navbar;

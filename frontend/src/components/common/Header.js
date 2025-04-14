import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  let dashboardLink = '/';
  if (currentUser) {
    if (currentUser.role === 'admin') {
      dashboardLink = '/admin';
    } else if (currentUser.role === 'user') {
      dashboardLink = '/user';
    } else if (currentUser.role === 'store_owner') {
      dashboardLink = '/store-owner';
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={dashboardLink}>Store Rating System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && (
              <Nav.Link as={Link} to={dashboardLink}>Dashboard</Nav.Link>
            )}
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                <span className="navbar-text me-3">
                  Welcome, {currentUser.name} ({currentUser.role})
                </span>
                <Nav.Link as={Link} to="/change-password">Change Password</Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

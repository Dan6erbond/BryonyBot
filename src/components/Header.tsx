import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../Firebase";
import { RootState } from "../store";
import { setIsAdmin, setLoggedIn } from "../store/User";
import "./Header.scss";

interface HeaderProps {
  firebase?: Firebase;
  loggedIn: boolean;
  isAdmin: boolean;
  setLoggedIn: typeof setLoggedIn;
  setIsAdmin: typeof setIsAdmin;
}

function Header({
  firebase,
  loggedIn,
  isAdmin,
  setLoggedIn,
  setIsAdmin,
}: HeaderProps) {
  const signOut = () => {
    try {
      firebase?.signOut();
      setLoggedIn(false);
      setIsAdmin(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg">
      <Navbar.Brand as={Link} to="/">
        <img
          alt="GTAOnline Weekly Updates"
          src="/res/img/community_icon.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        &nbsp;&nbsp; GTA Weekly Updates
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/vehicles">
            Vehicles
          </Nav.Link>
        </Nav>
        <Nav>
          {loggedIn && isAdmin && (
            <Nav.Link as={Link} to="/admin">
              Admin
            </Nav.Link>
          )}
          {loggedIn ? (
            <React.Fragment>
              <Nav.Link onClick={signOut}>Sign Out</Nav.Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Nav.Link as={Link} to="/login">
                Log In
              </Nav.Link>
              <Nav.Link as={Link} eventKey={2} to="/sign-up">
                Sign Up
              </Nav.Link>
            </React.Fragment>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.user.loggedIn,
  isAdmin: state.user.isAdmin,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setLoggedIn,
      setIsAdmin,
    },
    dispatch
  );

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Header) as any;

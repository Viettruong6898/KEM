
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, FormGroup, FormControl } from 'react-bootstrap';
import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Link,Redirect } from 'react-router-dom';

export default withAuth(
  class Home extends Component {
    state = { authenticated: null };

    checkAuthentication = async () => {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
      }
    };

    async componentDidMount() {
      this.checkAuthentication();
    }

    async componentDidUpdate() {
      this.checkAuthentication();
    }

    login = async () => {
      this.props.auth.login('/');
    };

    logout = async () => {
      this.props.auth.logout('/');
    };
   

    render() {
      if (this.state.authenticated === null) return null;
      const mainContent = this.state.authenticated ? (
        <div>
          <Navbar fluid={true}>
            <Nav pullRight >
              <NavItem href="/createuser">  Create User </NavItem>
              <NavItem href="/creategroup">  Create Group </NavItem>
              <NavItem onClick={this.logout}>  Log Out </NavItem>      
            </Nav>
          </Navbar>
        </div>
      ) : (
        <div>
          <Navbar fluid={true}>
            <Nav pullRight >
              <NavItem href="/createuser"> Create User </NavItem>
              <NavItem href="/creategroup">  Create Group </NavItem>
              <NavItem onClick={this.login}> Log In </NavItem>
            </Nav>
          </Navbar>
        </div>
      );

      return (
        <div >
          {mainContent}
        </div>
      );
    }
  }
);


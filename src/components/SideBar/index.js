import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Collapse } from 'react-bootstrap';
import UserInfo from './UserInfo';
import Log from './logIn';
import Nav from './Nav';
import { withAuth } from '@okta/okta-react';

class SideBar extends Component {
  state = { authenticated: null };

    checkAuthentication = async () => {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated && authenticated !== null) {
        this.setState({ authenticated });
      }
    };

    async componentDidMount() {
      this.checkAuthentication();
    }

    async componentDidUpdate() {
      this.checkAuthentication();
    }

  render() {
    let {
      backgroundColor,
    } = this.props;
    if (this.state.authenticated === null) return null;
    const mainContent = this.state.authenticated ? (
      <div>
        <Log />
      </div>
    ) : (
      <div>
        <UserInfo />
      </div>
    );
    return (
      <div className="sidebar" data-color={backgroundColor}>
        <div className="brand">
          <a href="https://www.kohls.com/" className="brand-name">
            <img src={'https://cdn.patchcdn.com/users/22872566/2016/03/T800x600/20160356eabb289c60c.jpg'} alt="logo" className="logo" />
          </a>
        </div>
        <div className="sidebar-wrapper">
          {mainContent}
          <div className="line"></div>
          <Nav />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  enableBackgroundImage: state.ThemeOptions.enableBackgroundImage,
  backgroundColor: state.ThemeOptions.backgroundColor,
});

export default withAuth(withRouter(
  connect(mapStateToProps)(SideBar)
));
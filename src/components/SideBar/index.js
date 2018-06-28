import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Collapse } from 'react-bootstrap';
import UserInfo from './UserInfo';
import Nav from './Nav';

class SideBar extends Component {

  state = {};

  render() {
    let {
      backgroundColor,
    } = this.props;

    return (
      <div className="sidebar" data-color={backgroundColor}>

        <div className="brand">
          <a href="https://www.kohls.com/" className="brand-name">
            <img src={'https://cdn.patchcdn.com/users/22872566/2016/03/T800x600/20160356eabb289c60c.jpg'} alt="logo" className="logo" />
          </a>
        </div>
        <div className="sidebar-wrapper">
          <UserInfo />
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

export default withRouter(
  connect(mapStateToProps)(SideBar)
);
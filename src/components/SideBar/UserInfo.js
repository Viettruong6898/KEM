import React, { Component } from 'react';
import { Collapse } from 'react-bootstrap';
import { connect } from 'react-redux';
import cx from 'classnames';

class UserInfo extends Component {

  state = {
    isShowingUserMenu: false
  };

  render() {
    let { user } = this.props;
    return (
      <div className="user-wrapper">
        <div className="user">
          <div className="userinfo">
            <div className="username">
              Welcome Viet Truong{/* {user.name} */}
            </div>
            <div className="title">Admin</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user
});

export default connect(mapStateToProps)(UserInfo);
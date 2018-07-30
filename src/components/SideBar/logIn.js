import React, { Component } from 'react';

class log extends Component {
  value = 'User';
  state = {
    currentUserName: '',
    currentUserGroupStatus: ''
  };

  componentDidMount() {
    const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
    for (var number in idToken.idToken.claims.groups) {
      if (idToken.idToken.claims.groups[number] === 'Admin') {
        this.value = 'Admin'
      }
    }
    this.setState({
      currentUserGroupStatus: this.value,
      currentUserName: idToken.idToken.claims.name
    });
  }

  render() {
    const { currentUserGroupStatus, currentUserName } = this.state;
    

    return (
        <div className="user-wrapper">
        <div className="user">
          <div className="userinfo">
            <div className="username">
            Welcome {currentUserName}
            </div>
            <div className="title">{currentUserGroupStatus}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default log;

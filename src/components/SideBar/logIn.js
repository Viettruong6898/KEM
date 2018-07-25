import React, { Component } from 'react';

class log extends Component {
  value = 'Users';
  state = {
    currentUserName: '',
    currentUserGroupStatus: ''
  };

  componentDidMount() {
    const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
    console.log(this) 
    console.log(idToken);
    for (var number in idToken.idToken.claims.groups) {
      if (idToken.idToken.claims.groups[number] === 'Admins') {
        this.value = 'Admins'
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

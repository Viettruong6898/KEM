import React, { Component } from 'react';

class log extends Component {
  state = {
    currentUserName: '',
    currentUserEmail: ''
  };

  componentDidMount() {
    const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
    this.setState({
      currentUserEmail: idToken.idToken.claims.email,
      currentUserName: idToken.idToken.claims.name
    });
  }

  render() {
    const { currentUserEmail, currentUserName } = this.state;
    console.log(this.state);
    

    return (
        <div className="user-wrapper">
        <div className="user">
          <div className="userinfo">
            <div className="username">
            Welcome {currentUserName}
            </div>
            <div className="title">Email: {currentUserEmail}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default log;

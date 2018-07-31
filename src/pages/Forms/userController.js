import React from 'react'
import Regist from './regisForm'
import { withAuth } from '@okta/okta-react';

class userController extends React.Component {
  insert = false

  state = {
   authenticated: null 
  };
  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }
    
  componentDidMount() {
    this.checkAuthentication();
    const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
    for (var number in idToken.idToken.claims.groups) {
      if (idToken.idToken.claims.groups[number] === 'Admin') {
        this.user = 'Admin'
      }
    }
    if(this.user === 'Admin') {
      this.insert = true;
    }
    }

   componentDidUpdate(prevProps,prevState) {
    this.checkAuthentication();
  }
  
  componentWillReceiveProps(props) {
    this.setState(props);
}
  submit = values => {
    var firstName = values.firstName;
    var lastName = values.lastName;
    var email = values.email;
    var password= values.password
    var hold = {};
    var allData = {};
    var profile = {};
    var passwords = {};
    hold["value"] = password
    profile["firstName"] = firstName;
    profile["lastName"] = lastName;
    profile["email"] = email;
    profile["login"] = email;
    passwords["password"] = hold;
    allData["profile"] = profile
    allData["credentials"] = passwords;
    console.log(JSON.stringify(allData))
    return fetch("http://localhost:8080/users/create", {
        method: 'PUT',
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json, text/plain, */*',
        'Accept': 'application/json',
        },
        body: JSON.stringify(allData)
        }).then(res => {
        return res;
        }).catch(err => alert(err));
      
  }

  render() {
    const cardStyle2 = {
      display: 'flex',
      alignItems:'center',
      justifyContent:'center',
      overFlow: 'auto',
      fontSize:'200%',
      };
    if (this.state.authenticated === null) return null;
    return this.insert ?(<Regist onSubmit={this.submit} /> ):(<div style={cardStyle2}> You're not an Admin; therefore, this page (Create Users) is unavailable to you. </div>)
  }
}
export default withAuth(userController)
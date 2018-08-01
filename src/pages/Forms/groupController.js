import React from 'react'
import GroupForm from './groupForm'
import { withAuth } from '@okta/okta-react';

class groupController extends React.Component {
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
   var allData = {};
   var profile = {};
   profile["name"] = values.groupName
   profile["description"] = values.groupDes
   allData["profile"] = profile
   alert(`Sucessfully created: ${values.groupName}`)
   return fetch("http://localhost:8080/users/groups/create", {
        method: 'POST',
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json'
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
    return this.insert ?(<GroupForm onSubmit={this.submit} /> ):(<div style={cardStyle2}> You're not an Admin; therefore, this page (Create New Groups) is unavailable to you. </div>)
  }
}
export default withAuth(groupController)
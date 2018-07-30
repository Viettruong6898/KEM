import React from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';


export default withAuth(class RegistrationForm extends React.Component{
user = 'User'
insert = false
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      groupName: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handlegroupNameChange = this.handlegroupNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  state = { authenticated: null };

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async componentDidMount() {
    const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
    for (var number in idToken.idToken.claims.groups) {
      if (idToken.idToken.claims.groups[number] === 'Admin') {
        this.user = 'Admin'
      }
    }
    if(this.user === 'Admin') {
      this.insert = true;
    }
    console.log(this.insert)
    this.checkAuthentication();
  }

  handleFirstNameChange(e){
    this.setState({firstName:e.target.value});
  }
  handleLastNameChange(e) {
    this.setState({ lastName: e.target.value });
  }
  handlegroupNameChange(e) {
    this.setState({ groupName: e.target.value });
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
    }
  handleSubmit(e){
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    })
    .catch(err => console.log);
  }

  render(){
    const cardStyle2 = {
        display: 'flex',
        alignItems:'center',
        justifyContent:'center',
        overFlow: 'auto',
        fontSize:'200%',
        };
    if (this.state.authenticated === null) return null;
    return this.insert ? (
      <form onSubmit={this.handleSubmit}>
        <div className="form-element">
          <label>groupName:</label>
          <input type="groupName" id="groupName" value={this.state.groupName}
		  onChange={this.groupNameChange}/>
        </div>
        <div className="form-element">
          <label>First Name:</label>
          <input type="text" id="firstName" value={this.state.firstName}
		  onChange={this.handleFirstNameChange} />
        </div>
        <div className="form-element">
          <label>Last Name:</label>
          <input type="text" id="lastName" value={this.state.lastName}
		  onChange={this.handleLastNameChange} />
        </div>
        <div className="form-element">
          <label>Password:</label>
          <input type="password" id="password" value={this.state.password}
		  onChange={this.handlePasswordChange} />
        </div>
        <input type="submit" id="submit" value="Register"/>
      </form>
    ) : ( <div style={cardStyle2}> You're not an Admin; therefore, this page (Create Group) is unavailable to you. </div> )
  }

});

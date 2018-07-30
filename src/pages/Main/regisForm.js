import React from 'react';
import { withAuth } from '@okta/okta-react';


export default withAuth(class RegistrationForm extends React.Component{
user = 'User'
insert = false
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  state = { authenticated: null };
  validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Must be 6 characters or more';
    }
    return errors;
  };

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
  handleEmailChange(e) {
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
    if (this.state.authenticated === null) return null;
    const cardStyle = {
      display: 'flex',
      alignItems:'center',
      justifyContent:'center',
      overFlow: 'auto',
      fontSize:'200%',
      };
    return this.insert ? (
      <div className="card">
    <div className="header">
      <h4> Registration Form</h4>
    </div>
      <form onSubmit={this.handleSubmit}>
      <div className="form-group">
          <label>Email </label>
          <input type="EmailName" id="EmailName" value={this.state.EmailName}
		  onChange={this.EmailNameChange}/>
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" id="firstName" value={this.state.firstName}
		  onChange={this.handleFirstNameChange} />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" id="lastName" value={this.state.lastName}
		  onChange={this.handleLastNameChange} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" id="password" value={this.state.password}
		  onChange={this.handlePasswordChange} />
        </div>
        <input type="submit" id="submit" value="Register"/>
      </form>
      </div>
    ) : ( <div style={cardStyle}> You're not an Admin; therefore, this page (Create User) is unavailable to you. </div> )
  }

});

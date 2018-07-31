import React from 'react'
import Regist from './regisForm'

class userController extends React.Component {
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
    return <Regist onSubmit={this.submit} />
  }
}
export default userController
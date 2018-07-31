import React from 'react'
import GroupForm from './groupForm'

class groupController extends React.Component {
  submit = values => {
   var allData = {};
   var profile = {};
   profile["name"] = values.groupName
   profile["description"] = values.groupDes
   allData["profile"] = profile
   return fetch("http://localhost:8080/users/groups/create", {
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
    return <GroupForm onSubmit={this.submit} />
  }
}
export default groupController
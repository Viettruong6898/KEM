import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Redirect,Link, withRouter } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';



class Users extends Component {
  pagename = "Users Information"
  id = ""
  path = ""
  insert = false;


  constructor(){
    super()
    this.usersValidator = this.usersValidator.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }
  
  selectRowProp = {
    mode: 'checkbox',
    bgColor: 'pink', 
    hideSelectColumn: true, 
    clickToSelect: true
  };

  cellEditProp = {
    mode: 'click',
    blurToSave: true,
    afterSaveCell: this.onAfterSaveCell.bind(this)
  };

  usersValidator(value,row) {    
    const response = { isValid: true, notification: { type: 'success', msg: 'Sucessfuly validate', title: 'WOOO' } };
    var groups;
    var error = false;
    var invalidGroup = ''
    if( value.indexOf(',') !== -1 ){
    groups = value.split(',');
    }
    for( var number in groups) {
      if(groups[number] in this.state.groupToGroupId) {
        error = false
      } else {
        error = true
        invalidGroup = `${groups[number]}`
      }
    }
    if (error) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = ` Please enter a valid group or add ',' between the groups`;
      response.notification.title = `"${invalidGroup}" is not a valid group`;
    } 
    return response;
  }

  // this method is for updating data in the tables
  onAfterSaveCell(row, cellName, cellValue) {
    this.setState({counter :0})
    var currentGroups;
    var currentGroupsLength = 1;
    if( row.group.indexOf(',') !== -1 ){
    currentGroups = row.group.split(',');
    currentGroupsLength = currentGroupsLength + 1
    }
    var groupsToAdd = [];
    for (var item in currentGroups) {
      if(this.state.userToGroups[row.userName].includes(currentGroups[item])) {
        continue;
      }
      else {
        groupsToAdd.push(currentGroups[item])
      }
    }
  if(this.state.userToGroups[row.userName].length > currentGroupsLength) {
    this.setState({counter :1})
    alert("Removing a group is not supported, Failed to save")
    return;
  }
  for (var increment in groupsToAdd) {
    var groupId = this.state.groupToGroupId[groupsToAdd[increment]];
    this.UpdatingData(row.userId,groupId);
    return ;
  }
  alert("Sucessfully added group(s) to database")
}



  UpdatingData(userID,groupID) {
    return fetch(`http://localhost:8080/users/${userID}/groups/${groupID}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
    }).then(res => {
    return res;
    }).catch(err => alert(err));
    }

    getDifferentPageName = async() => {
      this.path = this.props.location.pathname;
      const api_call = await fetch(`http://localhost:8080${this.path}/all/groups`);
      const data = await api_call.json(); 
      const datas = [] 
      const usersToId= {}
      const groupsToId = {}
      const userToGroup = {};
      for (var each in data) {
        var allGroupsUserIsApartOf = []
        for (var type in data[each].group) {
          var currentStat = 'User'
          if(data[each].group[type].profile.name === 'Admin')  {
            currentStat = 'Admin'
          }
          allGroupsUserIsApartOf.push(data[each].group[type].profile.name);
        }
      if (data[each].id===undefined) {
        alert('This url is not Valid: Please check for correction');
        return <Link to="http://localhost:3000/">Home</Link>
      } else {
        var userID = data[each].id;
        var userName = data[each].profile.firstName + ' ' + data[each].profile.lastName;
        usersToId[userName] = userID;
        var groupID = data[each].group[type].id;
        var groupNames = data[each].group[type].profile.name;
        groupsToId[groupNames] = groupID;
        userToGroup[userName] = allGroupsUserIsApartOf;
          datas.push({
            userId: userID,
            userName: userName ,
            group: allGroupsUserIsApartOf,
            currentStatus: currentStat
        });
        }}
        this.setState({userToUserId: usersToId, groupToGroupId: groupsToId, userToGroups:userToGroup})
      return datas; }

  state = {
    userToUserId : {},
    groupToGroupId :{},
    userToGroups:{},
    state : { authenticated: null },
    counter : 0
  };
  
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
    this.getDifferentPageName().then(result => this.setState({
      data: result,
    }))}

   componentDidUpdate(prevProps,prevState) {
    this.checkAuthentication();
     if (prevProps !== this.props || this.state.counter !== 0) {
    this.getDifferentPageName().then(result => this.setState({
      data: result
    }))}
}
  
  componentWillReceiveProps(props) {
    this.setState(props);
}



  cardStyle = {
    display: 'flex',
    alignItems:'center',
    height: '10vh',
    width:"60vh",
    float:'right',
    overFlow: 'auto',
    fontSize:'150%',
    };


  render() {
    const cardStyle2 = {
      display: 'flex',
      alignItems:'center',
      justifyContent:'center',
      overFlow: 'auto',
      fontSize:'200%',
      };

    const options = {
      sizePerPage: 20,
      prePage: 'Previous',
      nextPage: 'Next',
      firstPage: 'First',
      lastPage: 'Last',
      hideSizePerPage: true,
      afterSaveCell: this.onAfterSaveCell,
    };
    if (this.state.authenticated === null) return null;
    return this.insert ?(
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h3>{this.pagename}</h3>
                <div style={this.cardStyle} className="text-right">
                   <Link to="/createuser">
                      <button> Create New User </button>
                      </Link>
                    </div>
                    <div style={this.cardStyle} className="text-right">
                   <Link to="/creategroup">
                      <button> Create New Group </button>
                      </Link>
                    </div>
              </div>
              <div className="content">
                <BootstrapTable
                  cellEdit={this.cellEditProp} 
                  data={this.state.data}
                  bordered={false}
                  striped
                  pagination={true}
                  options={options}
                  selectRow={ this.selectRowProp }
                  hover={true}
                  >
                  <TableHeaderColumn
                    dataField='userId'
                    width="35%"
                    isKey
                    editable={{type:'textarea',readOnly:true}}
                    dataSort
                    hiddenOnInsert
                    autoValue
                    filter={ { type: 'TextFilter'} }
                    >
                    userId
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='currentStatus'
                    width="35%"
                    editable={ { type: 'textarea',readOnly:true}}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    currentStatus
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='userName'
                    width="35%"
                    editable={{type:'textarea',readOnly:true}}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    userName
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='group'
                    width="35%"
                    editable={ { type: 'textarea',validator: this.usersValidator } }
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    groups
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>

    ) : (<div style={cardStyle2}> You're not an Admin; therefore, this page (All Users) is unavailable to you. </div>)
  }
}
export default withAuth(Users)
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link, withRouter } from 'react-router-dom';
import { GeoJSONSource } from 'mapbox-gl';
import { ISO_8601 } from 'moment';



class holidayListTable extends Component {
  pagename = "Holiday List"
  id = ""
  path = ""
  toProd= false;
  firstUpdate = true;
  insert = false;
  user = 'Users'

  constructor(){
    super()
    this.buttonUpdateOnClick = this.buttonUpdateOnClick.bind(this);
    this.resetUpdateOnClick = this.resetUpdateOnClick.bind(this);
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
  
  numberValidator(value, row) {
    const response = { isValid: true, notification: { type: 'success', msg: 'Sucessfuly validate', title: 'WOOO' } };
    if (String(parseInt(value)) !== value && String(parseInt(value)).concat(".0") !== value) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'This field only accepts numbers';
      response.notification.title = 'Error: Invalid Type';
    } 
    return response;
  }
  booleanValidator(value, row) {
    const response = { isValid: true, notification: { type: 'success', msg: 'Sucessfuly validate', title: 'WOOO' } };
    if (value !== 'false' && value !== 'true') {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'This field only accepts booleans, please put either true or false';
      response.notification.title = 'Error: Invalid Type';
    } 
    return response;
  }
  dateValidator(value, row) {
    const response = { isValid: true, notification: { type: 'success', msg: 'Sucessfuly validate', title: 'WOOO' } };
    var time = value.slice(0,4).concat("-",value.slice(5,7),"-",value.slice(8,13),
    ":",value.slice(14,16),":",value.slice(17,19),".",value.slice(20,23),"+",value.slice(24,28))
    if (value !== time){
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Please input this date as an ISO format';
      response.notification.title = 'Error: Invalid Type';
    } 
    return response;
  }

   // this method is for sending data back to the backend
   onAfterInsertRow(row) {
    var needUpdate = false;
    this.id = row.id;
    this.updatingButtonOnSaveCell(this.id,this.id);
    var boolean = true;
    this.id= row.id;
    if (row.active === "false") {
      boolean = false;
    }
    var updateValue = ({
          holidayId: row.holidayId,
          holidayName: row.holidayName,
          holidayDate: row.holidayDate,
          active: boolean
        })
    for (var item in this.state.data){
          if (this.id === this.state.data[item].id) {
            needUpdate = true;
            updateValue = ({
              holidayId:row.holidayId,
              holidayName:row.holidayName,
              holidayDate: row.holidayDate,
              active: boolean  
              })
          }
        }
        this.setState({counter:this.state.counter + 1})
    if (needUpdate) {
      return this.UpdatingData(updateValue);
    } else{
      return this.CreatingData(updateValue);
    }
  }

  CreatingData(data) {
    const nData= JSON.stringify(data);
    this.firstUpdate = false;
    return fetch(`http://localhost:8080/shippinginfos/holidaylists/all`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: nData
    }).then(res => {
      alert(`Sucessfully saved the value!`);
    return res;
    }).catch(err => alert(err));
  }

  sendToStaging() {
    return fetch("http://localhost:8080/shippinginfos/holidaylists/stage", {
    method: 'PUT',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json, text/plain, */*',
    'Accept': 'application/json',
    },
    body: ''
    }).then(res => {
    return res;
    }).catch(err => alert(err));
  }

  sendToProd() {
    return fetch("http://localhost:8080/shippinginfos/holidaylists/prod", {
    method: 'PUT',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json, text/plain, */*',
    'Accept': 'application/json',
    },
    body: ''
    }).then(res => {
    return res;
    }).catch(err => alert(err));
  }

  sendToReset() {
    return fetch("http://localhost:8080/shippinginfos/holidaylists/cancelnew", {
    method: 'PUT',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json, text/plain, */*',
    'Accept': 'application/json',
    },
    body: ''
    }).then(res => {
    return res;
    }).catch(err => alert(err));
  }



  // this method is for updating data in the tables
  onAfterSaveCell(row, cellName, cellValue) {
    var boolean = true;
    this.id= row.id;
    this.updatingButtonOnSaveCell(this.id,row.pushedToStage);
    if (row.active === "false") {
      boolean = false;
    }
    var newValue = ({
      id: this.id,
      holidayId: Number(row.holidayId),
      holidayName: row.holidayName,
      holidayDate: row.holidayDate,
      active:  Boolean(boolean)
      })
    return this.UpdatingData(newValue);
  }
  updatingButtonOnSaveCell(id,value) {
    var updatingStaging = {}
    updatingStaging[id] = value;
    this.setState({stagingList: updatingStaging});
    this.setState({toProd : false});
    this.setState({reset : true});
}

  UpdatingData(data) {
    this.firstUpdate = false;
    return fetch(`http://localhost:8080/shippinginfos/holidaylists/${this.id}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
    }).then(res => {
      alert(`Sucessfully saved the value!`);
    return res;
    }).catch(err => alert(err));
    
    }

    getDifferentPageName = async() => {
      this.path = this.props.location.pathname;
      const api_call = await fetch(`http://localhost:8080/${this.path}/all`);
      const data = await api_call.json(); 
      const datas = [] 
      for (var each in data) {
        var keyy = data[each].id;
        var value = data[each].pushedToStage;
        var pair = {}
        pair[keyy] = value;
        this.setState({stagingList: pair})
      if (data[each].id===undefined) {
        alert('This url is not Valid: Please check for correction');
        return <Link to="http://localhost:8080/">Home</Link>
      } else {
        this.id = data[each].id
          datas.push({
            id: data[each].id,
            holidayId: data[each].holidayId,
            holidayName:data[each].holidayName,
            holidayDate: data[each].holidayDate,
            active: data[each].active
            
        });
        } }
      return datas; }

  state = {
    stagingList : {},
    toProd : false,
    counter: 0,
    reset: false
  };
  
  componentDidMount() {
    const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
    for (var number in idToken.idToken.claims.groups) {
      if (idToken.idToken.claims.groups[number] === 'Admins') {
        this.user = 'Admins'
      }
    }
    if(this.user === 'Admins') {
      this.insert = true;
    }
    this.getDifferentPageName().then(result => this.setState({
      data: result,
    }))}

   componentDidUpdate(prevProps,prevState) {
     if (prevProps !== this.props || this.state.counter !== prevState.counter) {
    this.getDifferentPageName().then(result => this.setState({
      data: result
    }))}
}

  
  componentWillReceiveProps(props) {
    this.setState(props);
}

  buttonUpdateOnClick() {
    if (this.firstUpdate || (!Object.keys(this.state.stagingList).length && this.state.toProd === true)) {
      alert("Failed to push to staging, all datas are up to date");
    }
    else if (Object.keys(this.state.stagingList).length) {
      const hold = Object.assign({}, this.state.stagingList);
      delete hold[`${this.id}`];
      this.setState({stagingList: hold});
      this.sendToStaging(); 
      alert("Sucessfully pushed to Staging"); 
    }
    else {
      this.setState({toProd: true}); 
      this.sendToProd(); 
      alert("Sucessfully pushed to Production");
    }
    return ;
  }

  resetUpdateOnClick(){
    if (this.state.reset === true ){
      alert("Sucessfully resetted the data");
      this.sendToReset();
      this.setState({reset:false})
    } 
    return ;
  }

  cardStyle = {
    display: 'flex',
    alignItems:'center',
    height: '10vh',
    width:"42vh",
    float:'right',
    overFlow: 'auto',
    fontSize:'150%',
    };

  render() {
    var disableButton = false;
    var resetButton = true;
    if ( this.state.reset === true ) {
      resetButton = false;
    };
    if (!Object.keys(this.state.stagingList).length && this.state.toProd === false) {
      disableButton = true;
    }
    if (this.state.toProd === true) {
      disableButton = false;
      this.state.toProd = true;
    }
    const options = {
      sizePerPage: 20,
      prePage: 'Previous',
      nextPage: 'Next',
      firstPage: 'First',
      lastPage: 'Last',
      hideSizePerPage: true,
      afterSaveCell: this.onAfterSaveCell,
      afterInsertRow: this.onAfterInsertRow.bind(this)
    };
    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h4>{this.pagename}</h4>
                <div style={this.cardStyle} className="text-right">
                      <button onClick={this.buttonUpdateOnClick} disabled={disableButton} > Push to Staging </button>
                    </div>
                    <div style={this.cardStyle} className="text-right">
                      <button onClick= {this.buttonUpdateOnClick} disabled={!disableButton}> Push to Production </button>
                    </div>
                    <div style={this.cardStyle} className="text-right">
                       <button disabled={resetButton} onClick= {this.resetUpdateOnClick}> Reset all changes </button>
                </div>
              </div>
              <div className="content">
                <BootstrapTable
                  cellEdit={this.cellEditProp}
                  insertRow={this.insert}
                  data={this.state.data}
                  bordered={false}
                  striped
                  pagination={true}
                  options={options}
                  selectRow={ this.selectRowProp }
                  hover={true}
                  >
                   <TableHeaderColumn
                    dataField='id'
                    width="15%"
                    isKey
                    editable={{type:'textarea',readOnly:true}}
                    filter={ { type: 'TextFilter'} }
                    dataSort
                    hiddenOnInsert
                    autoValue
                    >
                    id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='holidayId'
                    width="10%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    holidayId
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='holidayName'
                    width="10%"
                    editable={ { type: 'textarea' }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    holidayName
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='holidayDate'
                    width="20%"
                    editable={ { type: 'textarea',validator:this.dateValidator}}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    holidayDate
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='active'
                    width="15%"
                    editable={ { type: 'textarea',validator: this.booleanValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    active?
                  </TableHeaderColumn>
                  
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default holidayListTable
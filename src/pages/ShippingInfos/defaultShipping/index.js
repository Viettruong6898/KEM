import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link, withRouter } from 'react-router-dom';



class defaultShippingTable extends Component {
  pagename = "Default Shipping Methods"
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
    beforeSaveCell: this.numberValidator.bind(this),
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


   // this method is for sending data back to the backend
   onAfterInsertRow(row) {
    var needUpdate = false;
    this.updatingButtonOnSaveCell(this.id,this.id);
    this.id = row.id;
    var updateValue = ({
        defaultShipMethodId: row.defaultShipMethodId,
        shipMethodName: row.shipMethodName,
        shippingMethodServiceCode: row.shippingMethodServiceCode
        })

    for (var item in this.state.data){
          if (this.id === this.state.data[item].id) {
            needUpdate = true;
            updateValue = ({
              id: this.state.data[item].id,
              defaultShipMethodId: row.defaultShipMethodId,
              shipMethodName: row.shipMethodName,
              shippingMethodServiceCode: row.shippingMethodServiceCode
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
    return fetch("http://localhost:8080/shippinginfos/defaultshippings/all", {
    method: 'put',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: nData
    }).then(res => {
    return res;
    }).catch(err => alert(err));
  }
  sendToStaging() {
    return fetch("http://localhost:8080/shippinginfos/defaultshippings/stage", {
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
    return fetch("http://localhost:8080/shippinginfos/defaultshippings/prod", {
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
    return fetch("http://localhost:8080/shippinginfos/defaultshippings/cancelnew", {
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
    this.id = row.id;
    this.updatingButtonOnSaveCell(this.id,row.pushedToStage);
    var newValue = ({
        id: this.id,
        defaultShipMethodId: row.defaultShipMethodId,
        shipMethodName: row.shipMethodName,
        shippingMethodServiceCode: row.shippingMethodServiceCode
      })
    alert(`Sucessfully saved the value!`);
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
    return fetch(`http://localhost:8080/shippinginfos/defaultshippings/${this.id}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: JSON.stringify(data)
    }).then(res => {
    return res;
    }).catch(err => alert(err));
    }

    getDifferentPageName = async() => {
      this.path = this.props.location.pathname;
      const api_call = await fetch(`http://localhost:8080/shippinginfos/defaultshippings/all`);
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
              defaultShipMethodId: data[each].defaultShipMethodId,
              shipMethodName: data[each].shipMethodName,
              shippingMethodServiceCode: data[each].shippingMethodServiceCode,
              pushedToStage: data[each].pushedToStage,
              pushedToProd: data[each].pushedToProd
          }
        );
        } 
      }
      return datas; 
    }

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
    }))
  }
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
      alert("Sucessfully pushed to Staging"); }
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
      disableButton = false;
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
                    width="25%"
                    isKey
                    editable={{type:'textarea',readOnly:true, validator: this.jobNameValidator}}
                    dataSort
                    hiddenOnInsert
                    autoValue
                    filter={ { type: 'TextFilter'} }
                    >
                    id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='defaultShipMethodId'
                    width="20%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    defaultShipMethodId
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='shipMethodName'
                    width="20%"
                    editable={ { type: 'textarea'}}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    shipMethodName
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='shippingMethodServiceCode'
                    width="20%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    shippingmethodServiceCode
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
export default defaultShippingTable
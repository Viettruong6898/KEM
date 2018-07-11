import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link, withRouter } from 'react-router-dom';



class shippingMethodsTable extends Component {
  pagename = "Shipping Methods"
  id = ""
  path = ""
  toProd= false;
  notUpdated = true;

  constructor(){
    super()
    this.buttonUpdateOnClick = this.buttonUpdateOnClick.bind(this);
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
    if (String(parseInt(value)) !== value && String(parseInt(value)).concat(".0") !== value ) {
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
  numberArrayValidator(value,row) {    
    const response = { isValid: true, notification: { type: 'success', msg: 'Sucessfuly validate', title: 'WOOO' } };
    const number = value.replace(',','')
    if (String(parseInt(number)) !== number) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'This field only accepts numbers and list of numbers ex:3,4';
      response.notification.title = 'Error: Invalid Type';
    } 
    return response;
  }

   // this method is for sending data back to the backend
   onAfterInsertRow(row) {
    var needUpdate = false;
    this.notUpdated = false;
    this.id = row.id;
    var updateValue = ({
      methodID: row.methodID,
      methodName: row.methodName,
      methodCode: row.methodCode,
      incrementCharge: row.incrementCharge,
      incrementLimit: row.incrementLimit,
      minShippingLeadDays: Number(row.minShippingLeadDays),
      maxShippingLeadDays:  Number(row.maxShippingLeadDays),
      active: Boolean(row.active),
      cutOffTime: Number(row.cutOffTime),
      qualifiedStateCodes: Array(row.qualifiedStateCodes),
      nonQualifiedStateCodes: Array(row.nonQualifiedStateCodes),
      showCutOffMessage: Boolean(row.showCutOffMessage),
      shippingServiceCodes: Array(row.shippingServiceCodes),
      tierGroup: row.tierGroup
        })
    for (var item in this.state.data){
          if (this.id === this.state.data[item].id) {
            needUpdate = true;
            updateValue = ({
              methodID: this.id,
              methodName: row.methodName,
              methodCode: row.methodCode,
              incrementCharge: row.incrementCharge,
              incrementLimit: row.incrementLimit,
              minShippingLeadDays: row.minShippingLeadDays,
              maxShippingLeadDays: row.maxShippingLeadDays,
              active: row.active,
              cutOffTime: row.cutOffTime,
              qualifiedStateCodes: row.qualifiedStateCodes,
              nonQualifiedStateCodes: row.nonQualifiedStateCodes,
              showCutOffMessage: row.showCutOffMessage,
              shippingServiceCodes: row.shippingServiceCodes,
              tierGroup: row.tierGroup
              })
          }
        }
    if (needUpdate) {
      return this.UpdatingData(updateValue);
    } else{
      return this.CreatingData(updateValue);
    }
  }

  CreatingData(data) {
    // if the format isnt correct it will not be able to create the content everything is alreay parsed correctly above
    const tierGroupData= JSON.stringify(data,["tierGroup"]).replace(/\\n/g, "").replace(/\\/g, "");
    const tgKey = tierGroupData.slice(1,13);
    const tgVal = tierGroupData.slice(14,-2);
    const otherData = JSON.stringify(data,["methodID","methodName","methodCode","incrementCharge","incrementLimit","minShippingLeadDays"
  ,"maxShippingLeadDays","active","cutOffTime","qualifiedStateCodes","nonQualifiedStateCodes",
  "showCuttOffMessage","shippingServiceCodes"]).replace(/\\/g, "");
    const retData= otherData.slice(0,-1).concat(",",tgKey,"{",tgVal,"}")
    console.log(retData);
    return fetch(`http://localhost:8080/shippinginfos/shippingmethods/all`, {
    method: 'put',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: retData
    }).then(res => {
    return res;
    }).catch(err => alert(err));
  }

  sendToStaging() {
    return fetch("http://localhost:8080/shippinginfos/shippingmethods/stage", {
    method: 'PUT',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json, text/plain, */*',
    'Accept': 'application/json',
    },
    body: {}
    }).then(res => {
      console.log(res);
    return res;
    }).catch(err => alert(err));
}
  sendToProd() {
    return fetch("http://localhost:8080/shippinginfos/shippingmethods/prod", {
    method: 'PUT',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json, text/plain, */*',
    'Accept': 'application/json',
    },
    body: {}
    }).then(res => {
      console.log(res);
    return res;
    }).catch(err => alert(err));
    }

    

  // this method is for updating data in the tables
  onAfterSaveCell(row, cellName, cellValue) {
    this.id=row.id;
    this.updatingButtonOnSaveCell(this.id,row.pushedToStage);
    var newValue = ({
      methodID: row.methodID,
      methodName: row.methodName,
      methodCode: row.methodCode,
      incrementCharge: row.incrementCharge,
      incrementLimit: row.incrementLimit,
      minShippingLeadDays: row.minShippingLeadDays,
      maxShippingLeadDays: row.maxShippingLeadDays,
      active: row.active,
      cutOffTime: row.cutOffTime,
      qualifiedStateCodes: row.qualifiedStateCodes,
      nonQualifiedStateCodes: row.nonQualifiedStateCodes,
      showCutOffMessage: row.showCutOffMessage,
      shippingServiceCodes: row.shippingServiceCodes,
      tierGroup: row.tierGroup
      })
    alert(`Sucessfully saved the value!`);
    return this.UpdatingData(newValue);
  }
  updatingButtonOnSaveCell(id,value) {
    var updatingStaging = {}
    updatingStaging[id] = value;
    this.setState({stagingList: updatingStaging});
    this.setState({toProd : false});
}


  UpdatingData(data) {
    const tierGroupData= JSON.stringify(data,["tierGroup"]).replace(/\\/g, "");
    const tgKey = tierGroupData.slice(1,13);
    const tgVal = tierGroupData.slice(14,-2);
    const otherData = JSON.stringify(data,["methodID","methodName","methodCode","incrementCharge","incrementLimit","minShippingLeadDays"
  ,"maxShippingLeadDays","active","cutOffTime","qualifiedStateCodes","nonQualifiedStateCodes",
  "showCuttOffMessage","shippingServiceCodes"]).replace(/\\/g, "");
    const retData= otherData.slice(0,-1).concat(",",tgKey,tgVal,"}")
    return fetch(`http://localhost:8080/shippinginfos/shippingmethods/${this.id}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: retData
    }).then(res => {
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
        console.log(this.state.stagingList);
      if (data[each].id===undefined) {
        alert('This url is not Valid: Please check for correction');
        return <Link to="http://localhost:8080/">Home</Link>
      } else {
        this.id = data[each].id
          datas.push({
            id: data[each].id,
            methodID: data[each].methodID,
            methodName: data[each].methodName,
            methodCode: data[each].methodCode,
            incrementCharge: data[each].incrementCharge,
            incrementLimit: data[each].incrementLimit,
            minShippingLeadDays: data[each].minShippingLeadDays,
            maxShippingLeadDays: data[each].maxShippingLeadDays,
            active: data[each].active,
            cutOffTime: data[each].cutOffTime,
            qualifiedStateCodes: data[each].qualifiedStateCodes,
            nonQualifiedStateCodes: data[each].nonQualifiedStateCodes,
            showCutOffMessage: data[each].showCutOffMessage,
            shippingServiceCodes: data[each].shippingServiceCodes,
            tierGroup: JSON.stringify(data[each].tierGroup)
        });
        } }
      return datas; }

  state = {
    stagingList : {},
    toProd : false
  };
  
  componentDidMount() {
    this.getDifferentPageName().then(result => this.setState({
      data: result,
    }))}

   componentDidUpdate(prevProps,prevState) {
     if (prevProps !== this.props) {
    this.getDifferentPageName().then(result => this.setState({
      data: result
    }))}
}
  
  componentWillReceiveProps(props) {
    this.setState(props);
}

  buttonUpdateOnClick() {
    if (Object.keys(this.state.stagingList).length) {
      const hold = Object.assign({}, this.state.stagingList);
      delete hold[`${this.id}`];
      this.setState({stagingList: hold});
      this.sendToStaging(); 
      alert("Sucessfully pushed to Staging");
    } else if (!Object.keys(this.state.stagingList).length && this.state.toProd === true) {
      alert("Please make changes before pushing to staging");
    }
      else {
        this.setState({toProd: true}); 
        this.sendToProd(); 
        alert("Sucessfully pushed to Production");
    }
    return ;
  }
  cardStyle = {
    display: 'flex',
    alignItems:'center',
    height: '10vh',
    width:"45vh",
    float:'right',
    overFlow: 'auto',
    fontSize:'150%',
    };


  render() {
    var disableButton = false;
    if (!Object.keys(this.state.stagingList).length && this.state.toProd === false) {
      disableButton = true;
      console.log(this.state.toProd);
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
                <h3>{this.pagename} (The following are abbreviations for this table)</h3>
                <h5>mID = method ID</h5>
                <h5>mName = method Name</h5>
                <h5>mCode = method Code</h5>
                <h5>iC = incrementCharge</h5>
                <h5>iL= incrementLimit</h5>
                <h5>minSLD = minShippingLeadDays</h5>
                <h5>maxSLD = maxShippingLeadDays</h5>
                <h5>cOT = cutOffTime</h5>
                <h5>qSC = qualifiedStateCodes</h5>
                <h5>nQSC = nonQualifiedStateCodes</h5>
                <h5>sCOM = showCutOffMessage</h5>
                <h5>sSC = shippingServiceCodes</h5>
                <div style={this.cardStyle} className="text-right">
                      <button onClick={this.buttonUpdateOnClick} disabled={disableButton} > Push to Staging </button>
                    </div>
                    <div style={this.cardStyle} className="text-right">
                      <button onClick= {this.buttonUpdateOnClick} disabled={!disableButton}> Push to Production </button>
                    </div>
                    <div style={this.cardStyle} className="text-right">
                      <button> Reset all changes </button>
                </div>
              </div>
              <div className="content">
                <BootstrapTable
                  cellEdit={this.cellEditProp}
                  insertRow={true}
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
                    width="5%"
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
                    dataField='methodID'
                    width="5%"
                    editable={{type:'textarea', validator: this.numberValidator}}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    mID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='methodName'
                    width="9%"
                    editable={ { type: 'textarea' }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    mName
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='methodCode'
                    width="7%"
                    editable={ { type: 'textarea' }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    mCode
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='incrementCharge'
                    width="4%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    iC
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='incrementLimit'
                    width="5%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    iL
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='minShippingLeadDays'
                    width="7%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    minSLD
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='maxShippingLeadDays'
                    width="7%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    maxSLD
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='active'
                    width="5%"
                    editable={ { type: 'textarea', validator: this.booleanValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    active
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='cutOffTime'
                    width="5%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    cOT
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='qualifiedStateCodes'
                    width="4%"
                    editable={ { type: 'textarea' }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    qSC
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='nonQualifiedStateCodes'
                    width="5%"
                    editable={ { type: 'textarea' }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                    nQSC
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='showCutOffMessage'
                    width="6%"
                    editable={ { type: 'textarea', validator: this.booleanValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                   sCOM
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='shippingServiceCodes'
                    width="4%"
                    editable={ { type: 'textarea', validator: this.numberArrayValidator }}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                   sSC
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='tierGroup'
                    width="40%"
                    editable={ { type: 'textarea'}}
                    dataSort
                    filter={ { type: 'TextFilter'} }
                    >
                   tierGroup
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
export default shippingMethodsTable
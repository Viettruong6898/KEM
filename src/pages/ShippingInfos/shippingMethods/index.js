import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link, withRouter } from 'react-router-dom';



class shippingMethodsTable extends Component {
  pagename = "Shipping Methods"
  id = ""
  path = ""

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
      response.notification.msg = 'This field only accepts, please put either true or false';
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
      response.notification.msg = 'This field only accepts numbers';
      response.notification.title = 'Error: Invalid Type';
    } 
    return response;
  }

   // this method is for sending data back to the backend
   onAfterInsertRow(row) {
    var needUpdate = false;
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

  // this method is for updating data in the tables
  onAfterSaveCell(row, cellName, cellValue) {
    this.id=row.id;
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

  render() {
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
                    >
                    mName
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='methodCode'
                    width="7%"
                    editable={ { type: 'textarea' }}
                    dataSort
                    >
                    mCode
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='incrementCharge'
                    width="4%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    >
                    iC
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='incrementLimit'
                    width="5%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    >
                    iL
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='minShippingLeadDays'
                    width="7%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    >
                    minSLD
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='maxShippingLeadDays'
                    width="7%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    >
                    maxSLD
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='active'
                    width="5%"
                    editable={ { type: 'textarea', validator: this.booleanValidator }}
                    dataSort
                    >
                    active
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='cutOffTime'
                    width="5%"
                    editable={ { type: 'textarea', validator: this.numberValidator }}
                    dataSort
                    >
                    cOT
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='qualifiedStateCodes'
                    width="4%"
                    editable={ { type: 'textarea' }}
                    dataSort
                    >
                    qSC
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='nonQualifiedStateCodes'
                    width="5%"
                    editable={ { type: 'textarea' }}
                    dataSort
                    >
                    nQSC
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='showCutOffMessage'
                    width="6%"
                    editable={ { type: 'textarea', validator: this.booleanValidator }}
                    dataSort
                    >
                   sCOM
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='shippingServiceCodes'
                    width="4%"
                    editable={ { type: 'textarea', validator: this.numberArrayValidator }}
                    dataSort
                    >
                   sSC
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='tierGroup'
                    width="40%"
                    editable={ { type: 'textarea'}}
                    dataSort
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
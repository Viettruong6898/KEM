import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link, withRouter } from 'react-router-dom';
import Datetime from 'react-datetime';



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
    beforeSaveCell: this.jobNameValidator.bind(this),
    afterSaveCell: this.onAfterSaveCell.bind(this)
  };
  
  jobNameValidator(value, row) {
    const response = { isValid: true, notification: { type: 'success', msg: 'Sucessfuly validate', title: 'WOOO' } };
    if (!value) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Please Enter a value for this column';
      response.notification.title = 'Error: Value is None';
    } else if (value === "amazon") {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'BOOOOOOO';
      response.notification.title = 'Error: Value is invalid';
    }
    return response;
  }

   // this method is for sending data back to the backend
   onAfterInsertRow(row) {
    var date = new Date();
    var needUpdate = false;
    this.id = row.id;
    var updateValue = ({
          id: row.id,
          shipTierId: row.shipTierId,
          createdDate: date.toISOString(),
          updatedDate: date.toISOString(),
          displayName: row.displayName,
          minBound: row.minBound,
          maxBound: row.maxBound,
          shipRate: row.shipRate
        })
    for (var item in this.state.data){
          if (this.id === this.state.data[item].id) {
            needUpdate = true;
            updateValue = ({
              id: this.state.data[item].id,
              shipTierId: row.shipTierId,
              createdDate: row.createdDate,
              updatedDate: date.toISOString(),
              displayName: row.displayName,
              minBound: row.minBound,
              maxBound: row.maxBound,
              shipRate: row.shipRate
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
    const nData= JSON.stringify(data);
    return fetch(`http://localhost:8080/${this.path}/all`, {
    method: 'put',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json'
    },
    body: nData
    }).then(res => {
    return res;
    }).catch(err => alert(err));
    }

  // this method is for updating data in the tables
  onAfterSaveCell(row, cellName, cellValue) {
    var date = new Date();
    this.id=row.id;
    var newValue = ({
          id: row.id,
          shipTierId: row.shipTierId,
          createdDate: row.createdDate,
          updatedDate: date.toISOString(),
          displayName: row.displayName,
          minBound: row.minBound,
          maxBound: row.maxBound,
          shipRate: row.shipRate
      })
    alert(`Sucessfully saved the value!`);
    return this.UpdatingData(newValue);
}

  UpdatingData(data) {
    const nData= JSON.stringify(data);
    return fetch(`http://localhost:8080${this.path}/${this.id}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
    body: nData
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
      if (data[each].methodID===undefined) {
        alert('This url is not Valid: Please check for correction');
        return <Link to="http://localhost:8080/">Home</Link>
      } else {
        this.id = data[each].id
          datas.push({
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
            showCuttOffMessage: data[each].showCuttOffMessage,
            shippingServiceCodes: data[each].shippingServiceCodes,
            tierGroup: data[each].tierGroup
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
                <h4>{this.pagename}</h4>
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
                  validator={this.jobNameValidator}
                  hover={true}
                  >
                  <TableHeaderColumn
                    dataField='methodID'
                    width="10%"
                    isKey
                    editable={{type:'textarea',readOnly:true, validator: this.jobNameValidator}}
                    dataSort
                    hiddenOnInsert
                    autoValue
                    >
                    methodID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='methodName'
                    width="13%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    methodName
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='methodCode'
                    width="13%"
                    editable={ { type: 'textarea',readOnly:true, validator: this.jobNameValidator }}
                    dataSort
                    >
                    methodCode
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='incrementCharge'
                    width="14%"
                    editable={ { type: 'textarea',readOnly:true, validator: this.jobNameValidator }}
                    dataSort
                    >
                    incrementCharge
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='incrementLimit'
                    width="13%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    incrementLimit
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='minShippingLeadDays'
                    width="15%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    minShipLeadDays
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='maxShippingLeadDays'
                    width="15%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    maxShipLeadDays
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='active'
                    width="10%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    active
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='cutOffTime'
                    width="13%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    cutOffTime
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='qualifiedStateCodes'
                    width="10%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    qualifiedStateCodes
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='nonQualifiedStateCodes'
                    width="10%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    nonQualifiedStateCodes
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='showCutOffMessage'
                    width="13%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                   showCutOffMessage
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='shippingServiceCodes'
                    width="10%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                   shippingServiceCodes
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='tierGroup'
                    width="10%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
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
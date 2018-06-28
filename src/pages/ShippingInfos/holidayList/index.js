import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link, withRouter } from 'react-router-dom';



class holidayListTable extends Component {
  pagename = "Holiday List"
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
          holidayId:row.holidayId,
          holidayName: row.holidayName,
          holidayDate: date.toISOString(),
          active: row.active
        })
    for (var item in this.state.data){
          if (this.id === this.state.data[item].id) {
            needUpdate = true;
            updateValue = ({
              id: this.state.data.id,
              holidayId:row.holidayId,
              holidayName: row.holidayName,
              holidayDate: date.toISOString(),
              active: row.active  
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
    var newValue = ({
      id: row.id,
      holidayId:row.holidayId,
      holidayName: row.holidayName,
      holidayDate: date.toISOString(),
      active: row.active
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
      if (data[each].id===undefined) {
        alert('This url is not Valid: Please check for correction');
        return <Link to="http://localhost:8080/">Home</Link>
      } else {
        this.id = data[each].id
          datas.push({
            id: data[each].id,
            holidayId: data[each].holidayId,
            holidayName: data[each].holidayName,
            holidayDate: data[each].holidayDate,
            active: data[each].active
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
                    dataField='id'
                    width="15%"
                    
                    isKey
                    editable={{type:'textarea',readOnly:true, validator: this.jobNameValidator}}
                    dataSort
                    >
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='holidayId'
                    width="10%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    holidayId
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='holidayName'
                    width="20%"
                    editable={ { type: 'textarea',readOnly:true, validator: this.jobNameValidator }}
                    dataSort
                    >
                    holidayName
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='holidayDate'
                    width="20%"
                    editable={ { type: 'textarea',readOnly:true, validator: this.jobNameValidator }}
                    dataSort
                    >
                    holidayDate
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='active'
                    width="15%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
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
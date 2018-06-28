import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link} from 'react-router-dom';



class StaticPagesTable extends Component {
  pagename = ""
  id = ""
  path = "";

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
      response.notification.msg = 'Please Enter a value for this key';
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
    var dict = {};
    var keyy = row.keys;
    var value = row.value;
    var pageNameToLower = this.pagename.toLowerCase();
    dict[keyy] = `${value}`;
    var needUpdate = false;
    var newValue = ({
      pagename: pageNameToLower,
      messages: dict
      })
    var updateValue = ({
        id: row.id,
        pagename: pageNameToLower,
        messages: dict
        })
    for (var item in this.state.data){
          if (this.pagename === this.state.data[item].pagename) {
            needUpdate = true;
            updateValue = ({
              id: this.state.data[item].id,
              pagename: pageNameToLower,
              messages: dict
              })
          }
        }
    if (needUpdate) {
      return this.UpdatingData(updateValue);
    } else{
      return this.CreatingData(newValue);
    }
  }

  CreatingData(data) {
    const nData= JSON.stringify(data);
    return fetch("http://localhost:8080/staticpages/all", {
    method: 'PUT',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json, text/plain, */*',
    'Accept': 'application/json',
    },
    body: nData
    }).then(res => {
    return res;
    }).catch(err => alert(err));
    }

  // this method is for updating data in the tables
  onAfterSaveCell(row, cellName, cellValue) {
    var dict = {};
    var keyy = row.keys;
    var value = cellValue;
    dict[keyy] = `${value}`;
    var newValue = ({
      id: row.id,
      pagename: this.pagename,
      messages: dict
      })
    alert(`Sucessfully saved the value: ${value}`);
    return this.UpdatingData(newValue);
}

UpdatingData(data) {
  const nData= JSON.stringify(data);
  return fetch(`http://localhost:8080${this.path}`, {
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
    const api_call = await fetch(`http://localhost:8080${this.path}`);
    const data = await api_call.json(); 
    const datas = [] 
    if (data.id===undefined) {
      alert('This url is not Valid: Please check for correction');
      return <Link to="http://localhost:8080/">Home</Link>
    } else {
    this.pagename = data.pagename.charAt(0).toUpperCase() + data.pagename.slice(1);
    this.id=data.id;
    for (var key in data.messages){
        datas.push({
          pagename: this.pagename,
          id: this.id,
          keys: key,
          value: data.messages[key]
      });
      }
    return datas; }
  }

  state = {
  };
  
  componentDidMount() {
    this.getDifferentPageName().then(result => this.setState({
      data: result
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
                    dataField='keys'
                    width="25%"
                    filter={ { type: 'TextFilter'} }
                    editable={{type:'textarea',readOnly:true, validator: this.jobNameValidator}}
                    dataSort
                    >
                    Key
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='value'
                    width="65%"
                    editable={ { type: 'textarea', validator: this.jobNameValidator }}
                    dataSort
                    >
                    Value
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
export default StaticPagesTable
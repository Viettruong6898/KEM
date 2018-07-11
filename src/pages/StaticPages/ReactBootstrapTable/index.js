import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link} from 'react-router-dom';
import { isNull } from 'util';



class StaticPagesTable extends Component {
  page = ""
  id = ""
  path = "";
  toProd= false;
  firstUpdate = true;

  constructor(){
    super()
    this.buttonUpdateOnClick = this.buttonUpdateOnClick.bind(this);
  }

  selectRowProp = {
    mode: 'checkbox',
    bgColor: 'pink', 
    hideSelectColumn: true, 
    clickToSelect: true,
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
      response.notification.title = 'Error: Value is None';}
    return response;
  }
   // this method is for sending data back to the backend
   onAfterInsertRow(row) {
    this.id=row.id;
    var dict = {};
    var keyy = row.keys;
    var value = row.value;
    var pageToLower = this.page.toLowerCase();
    dict[keyy] = `${value}`;
    var needUpdate = false;
    var newValue = ({
      page: pageToLower,
      messages: dict
      })
    var updateValue = ({
        id: row.id,
        page: pageToLower,
        messages: dict
        })
    for (var item in this.state.data){
          if (this.page === this.state.data[item].page) {
            needUpdate = true;
            updateValue = ({
              id: this.state.data[item].id,
              page: pageToLower,
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
    this.firstUpdate = false;
    return fetch("http://localhost:8080/staticpages/all", {
    method: 'PUT',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json, text/plain, */*',
    'Accept': 'application/json',
    },
    body: nData
    }).then(res => {
      console.log(res);
    return res;
    }).catch(err => alert(err));
    }

  sendToStaging() {
      return fetch("http://localhost:8080/staticpages/stage", {
      method: 'PUT',
      mode: 'cors',
      headers: {
      'Content-Type': 'application/json, text/plain, */*',
      'Accept': 'application/json',
      },
      body: ''
      }).then(res => {
        console.log(res);
      return res;
      }).catch(err => alert(err));
  }
  sendToProd() {
    return fetch("http://localhost:8080/staticpages/prod", {
    method: 'PUT',
    mode: 'cors',
    headers: {
    'Content-Type': 'application/json, text/plain, */*',
    'Accept': 'application/json',
    },
    body: ''
    }).then(res => {
      console.log(res);
    return res;
    }).catch(err => alert(err));
    }

  // this method is for updating data in the tables
  onAfterSaveCell(row, cellName, cellValue) {
    this.id=row.id;
    var dict = {};
    var keyy = row.keys;
    var value = cellValue;
    dict[keyy] = `${value}`;
    this.updatingButtonOnSaveCell(this.id,row.pushedToStage);
    var newValue = ({
      id: row.id,
      page: this.page,
      messages: dict
      })
    alert(`Sucessfully saved the value: ${value}`);
    return this.UpdatingData(newValue);
}

updatingButtonOnSaveCell(id,value) {
    var updatingStaging = {}
    updatingStaging[id] = value;
    this.setState({stagingList: updatingStaging});
    this.setState({toProd : false});
}


UpdatingData(data) {
  const nData= JSON.stringify(data);
  this.firstUpdate = false;
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

  getDifferentPage = async() => {
    this.path = this.props.location.pathname;
    const api_call = await fetch(`http://localhost:8080${this.path}`);
    const data = await api_call.json(); 
    const datas = [] 
    var keyy = data.id;
    var value = data.pushedToStage;
    var pair = {}
    pair[keyy] = value;
    this.setState({stagingList: pair})
    console.log(this.state.stagingList);
    if (data.id===undefined) {
      alert('This url is not Valid: Please check for correction');
      return <Link to="http://localhost:8080/dashboard">Home</Link>
    } else {
    this.page = data.page.charAt(0).toUpperCase() + data.page.slice(1);
    this.id=data.id;
    for (var key in data.messages){
        datas.push({
          page: this.page,
          id: this.id,
          keys: key,
          value: data.messages[key]
      });
      }
    return datas; }
  }

  state = {
    stagingList : {},
    toProd : false
  };

  componentDidMount() {
    this.getDifferentPage().then(result => this.setState({
      data: result
    }))}

   componentDidUpdate(prevProps,prevState) {
     if (prevProps !== this.props) {
    this.getDifferentPage().then(result => this.setState({
      data: result
    }))
  }
  
}
  
  componentWillReceiveProps(props) {
    this.setState(props);
}

buttonUpdateOnClick() {
    if (this.firstUpdate) {
      alert("Failed to push to staging, all datas are up to date");
    }
    else if (Object.keys(this.state.stagingList).length) {
      const hold = Object.assign({}, this.state.stagingList);
      delete hold[`${this.id}`];
      this.setState({stagingList: hold});
      this.sendToStaging(); 
      alert("Sucessfully pushed to Staging");
    } else if ((!Object.keys(this.state.stagingList).length && this.state.toProd === true)) {
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
    }
    if (this.state.toProd === true) {
      disableButton = false;
      this.state.toProd = true;
    }
    const options = {
      sizePerPage: 100,
      prePage: 'Previous',
      nextPage: 'Next',
      firstPage: 'First',
      lastPage: 'Last',
      hideSizePerPage: true,
      afterSaveCell: this.onAfterSaveCell,
      afterInsertRow: this.onAfterInsertRow.bind(this),
      insertText: 'Create New Message'
    };
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h4>{this.page}</h4>
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
                  validator={this.jobNameValidator}
                  hover={true}
                  expandableRow={ this.isExpandableRow }
                  >
                   <TableHeaderColumn
                    dataField='id'
                    width="15%"
                    editable={{type:'textarea',readOnly:true, validator: this.jobNameValidator}}
                    dataSort
                    isKey
                    hiddenOnInsert
                    autoValue
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
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import generateData from '../generateData';

const data = generateData(1000);
const selectRowProp = {
  mode: 'checkbox',
  bgColor: 'pink', 
  hideSelectColumn: true, 
  clickToSelect: true
};
const cellEditProp = {
  mode: 'click',
  blurToSave: true,
  beforeSaveCell: jobNameValidator,
  afterSaveCell: onAfterSaveCell 
};
function onAfterSaveCell(row, cellName, cellValue) {
  alert(`Sucessfully saved this value`);
}

function jobNameValidator(value, row) {
  const response = { isValid: true, notification: { type: 'success', msg: 'Sucessfuly validate', title: 'WOOO' } };
  if (!value) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'Please Enter a value for this key';
    response.notification.title = 'Error: Value is None';
  }
  
  return response;
}

function onAfterInsertRow(row) {
  let newRowStr = '';

  for (const prop in row) {
    newRowStr += prop + ': ' + row[prop] + ' \n';
  }
  alert('Sucessfully created a new entry:\n' + newRowStr);
}
class ReactBootstrapTable extends Component {
  
  state = {
    data: generateData(500, false),
  };
  

  removeItem = itemId => {
    this.setState({
      data: data.filter(item => item.id !== itemId),
    });
  }

  render() {
    const { data } = this.state;
    const options = {
      sizePerPage: 20,
      prePage: 'Previous',
      nextPage: 'Next',
      firstPage: 'First',
      lastPage: 'Last',
      hideSizePerPage: true,
      afterInsertRow: onAfterInsertRow
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h4>Accordion</h4>
              </div>
              <div className="content">
                <BootstrapTable
                  cellEdit={cellEditProp}
                  insertRow={true}
                  data={data}
                  bordered={false}
                  striped
                  pagination={true}
                  options={options}
                  selectRow={ selectRowProp }
                  validator={jobNameValidator}
                  hover={true}
                  cellEdit={ cellEditProp }
                  >
                  <TableHeaderColumn
                    dataField='id'
                    isKey
                    width="10%"
                    editable={{type:'textarea',readOnly:true,validator: jobNameValidator}}
                    dataSort
                    >
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='name'
                    width="25%"
                    filter={ { type: 'TextFilter'} }
                    editable={{type:'textarea',readOnly:true, validator: jobNameValidator}}
                    dataSort>
                    Key
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='country'
                    width="70%"
                    editable={ { type: 'textarea', validator: jobNameValidator }}
                    dataSort
                    >
                    Value
                  
                  </TableHeaderColumn>
                  <TableHeaderColumn width="20%"></TableHeaderColumn>
                  
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default ReactBootstrapTable
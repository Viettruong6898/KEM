import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from './renderField';

const validate = values => {
  const errors = {};
  if (!values.groupName) {
    errors.groupName = 'Group Name is required';
  } 
  if (!values.groupDes) {
    errors.groupDes = 'Group Description is required';
  } 
  return errors;
};

const StackedForm = ({
  submitting,
  handleSubmit,
  submitForm
}) => (
  <div className="card">
    <div className="header">
      <h4>Create New Group </h4>
    </div>
    <div className="content">
      <form onSubmit={handleSubmit}>

      <div className="form-group">
          <label className="control-label">Group Name</label>
          <Field
            name="groupName"
            type="text"
            component={renderField} />
        </div>

        <div className="form-group">
          <label className="control-label">Group Description</label>
          <Field
            name="groupDes"
            type="text"
            component={renderField} />
        </div>


        <button type="submit" className="btn btn-fill btn-info" disabled={submitting}>Submit</button>
      </form>
    </div>
  </div>
);

export default reduxForm({
  form: 'stackedForm',
  validate
})(StackedForm)
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from './renderField';

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length <= 7) {
    errors.password = 'Must be 8 characters or more';
  }
  else if (values.password.search(/[a-z]/) < 0) {
    errors.password = "Your password needs a lower case letter"
  } else if(values.password.search(/[A-Z]/) < 0) {
    errors.password ="Your password needs an uppser case letter"
  } else  if (values.password.search(/[0-9]/) < 0) {
    errors.password ="Your password needs a number"
  } else  if (values.password.includes(values.firstName)) {
    errors.password ="Your password can not contain your first name"
  } else  if (values.password.includes(values.lastName)) {
    errors.password ="Your password can not contain your last name"
  }
  else{

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
      <h4>Create User </h4>
    </div>
    <div className="content">
      <form onSubmit={handleSubmit}>

      <div className="form-group">
          <label className="control-label">First Name</label>
          <Field
            name="firstName"
            type="text"
            component={renderField} />
        </div>

        <div className="form-group">
          <label className="control-label">Last Name</label>
          <Field
            name="lastName"
            type="text"
            component={renderField} />
        </div>

        <div className="form-group">
          <label className="control-label">Email</label>
          <Field
            name="email"
            type="email"
            component={renderField} />
        </div>

        <div className="form-group">
          <label className="control-label">Password</label>
          <Field
            name="password"
            type="password"
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
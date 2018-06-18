import React from 'react';
import { Route } from 'react-router-dom';
import ReactBootstrapTable from './ReactBootstrapTable';

const Tables = ({match}) => (
  <div className="content">
    <Route path={`${match.url}/accordion`} component={ReactBootstrapTable} />
    <Route path={`${match.url}/catalog`} component={ReactBootstrapTable} />
    <Route path={`${match.url}/myinfo`} component={ReactBootstrapTable} />
  </div>
);

export default Tables;
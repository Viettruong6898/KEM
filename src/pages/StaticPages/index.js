import React from 'react';
import { Route } from 'react-router-dom';
import StaticPagesTable from './ReactBootstrapTable';

const StaticPagesTableRoute = ({match}) => (
  <div className="content">
    <Route path={`${match.url}/:staticPageName`} component={StaticPagesTable} />
  </div>
);


export default StaticPagesTableRoute;
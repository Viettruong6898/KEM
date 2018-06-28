import React from 'react';
import { Route } from 'react-router-dom';
import shippingMasterTable from './shippingMaster';
import defaultShippingTable from './defaultShipping';
import holidayListTable from './holidayList';
import shippingMethodsTable from './shippingMethods';

const shippingInfosRoute = ({match}) => (
  <div className="content">
    <Route path={`${match.url}/shippingmasters`} component={shippingMasterTable} />
    <Route path={`${match.url}/defaultshippings`} component={defaultShippingTable} />
    <Route path={`${match.url}/holidaylists`} component={holidayListTable} />
    <Route path={`${match.url}/:shippingmaster`} component={shippingMethodsTable} />
  </div>
);


export default shippingInfosRoute;
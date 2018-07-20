import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import cx from 'classnames';
import { setMobileNavVisibility } from '../../reducers/Layout';
import { withRouter } from 'react-router-dom';
import Header from './Header';

import SideBar from '../../components/SideBar';
import Dashboard from '../Dashboard';
import StaticPagesTableRoute from '../StaticPages';
import shippingInfosRoute from '../ShippingInfos';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Login from '../auth/Login';
import Home from './Home';

function onAuthRequired({history}) {
  history.push('/login');
}

const Main = ({
  mobileNavVisibility,
  hideMobileMenu,
  history 
}) => {
  history.listen(() => {
    if (mobileNavVisibility === true) {
      hideMobileMenu();
    }
  });
  return (
    <Router>
    <Security
      issuer="https://dev-328632.oktapreview.com/oauth2/default"
      client_id="0oafqwenmmp9oyrsf0h7"
      redirect_uri={window.location.origin + '/implicit/callback'}
      onAuthRequired={onAuthRequired}
    >
<div className={cx({
  'nav-open': mobileNavVisibility === true
})}>
  <div className="wrapper">
    <div className="close-layer" onClick={hideMobileMenu}></div>
    <SideBar />
    <div className="main-panel">
      <Header />
      <Route path='/' exact={true} component={Home}/>
      <Route exact path="/dashboard" component={Dashboard} />
      <SecureRoute path="/staticpages" component={StaticPagesTableRoute} />
      <SecureRoute path="/shippinginfos" component={shippingInfosRoute} />
      <Route
            path="/login"
            render={() => (
              <Login baseUrl="https://dev-328632.oktapreview.com" />
            )}
          />
          <Route path="/implicit/callback" component={ImplicitCallback} />
    </div>
  </div>
</div>
</Security>
  </Router>
  )
};

const mapStateToProp = state => ({
  mobileNavVisibility: state.Layout.mobileNavVisibility
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  hideMobileMenu: () => dispatch(setMobileNavVisibility(false))
});

export default withRouter(connect(mapStateToProp, mapDispatchToProps)(Main));
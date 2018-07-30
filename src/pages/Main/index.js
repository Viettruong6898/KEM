import React,{Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './Header';
import Regist from './regisForm';
import GroupForm from './groupForm';
import SideBar from '../../components/SideBar';
import Dashboard from '../Dashboard';
import StaticPagesTableRoute from '../StaticPages';
import shippingInfosRoute from '../ShippingInfos';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Login from '../auth/Login';
import Users from '../Users';

function onAuthRequired({history}) {
  history.push('/login');
}

class Main extends Component {
  render() {
    return (
      <Router>
      <Security
        issuer="https://dev-820420.oktapreview.com/oauth2/default"
        client_id="0oafqx1rrvdHedTuu0h7"
        redirect_uri={'http://localhost:3000/implicit/callback'}
        onAuthRequired={onAuthRequired}
      >
    <div className="wrapper">
      <div className="close-layer"></div>
      <SideBar />
      <div className="main-panel">
        <Header />
        <Route path='/' exact={true} component={Dashboard}/>
        <SecureRoute path='/users' component={Users} />
        <SecureRoute path='/createuser' component={Regist} />
        <SecureRoute path='/creategroup' component={GroupForm} />
        <SecureRoute path="/staticpages" component={StaticPagesTableRoute} />
        <SecureRoute path="/shippinginfos" component={shippingInfosRoute} />
        <Route
              path="/login"
              render={() => (
                <Login baseUrl="https://dev-820420.oktapreview.com" />
              )}
            />
            <Route path="/implicit/callback" component={ImplicitCallback} />
      </div>
    </div>
  </Security>
    </Router>
    );
  }
}

export default Main
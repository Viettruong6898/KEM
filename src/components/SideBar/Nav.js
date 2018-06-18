import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';


class Nav extends Component {

  state = {};

  render() {
    let { location } = this.props;
    return (
      <ul className="nav">
        <li className={location.pathname === '/' ? 'active' : null}>
          <Link to="/">
            <i className="pe-7s-graph"></i>
            <p>Dashboard</p>
          </Link>
        </li>
        <li className={this.isPathActive('/shippingandholiday') || this.state.shippingandholidayMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ shippingandholidayMenuOpen: !this.state.shippingandholidayMenuOpen })} data-toggle="collapse">
            <i className="pe-7s-news-paper"></i>
            <p> Shipping and Holiday <b className="caret"></b></p>
          </a>
          <Collapse in={this.state.shippingandholidayMenuOpen}>
            <div>
              <ul className="nav">
                <li className={this.isPathActive('/shippingandholiday/accordion') ? 'active' : null}>
                  <Link to="/shippingandholiday/accordion">Accordion</Link>
                </li>
                <li className={this.isPathActive('/shippingandholiday/catalog') ? 'active' : null}>
                  <Link to="/shippingandholiday/catalog">Catalog</Link>
                </li>
                <li className={this.isPathActive('/shippingandholiday/myinfo') ? 'active' : null}>
                  <Link to="/shippingandholiday/myinfo">My Info</Link>
                </li>
                
              </ul>
            </div>
          </Collapse>
        </li>
        <li className={this.isPathActive('/staticmessages') || this.state.staticmessagesMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ staticmessagesMenuOpen: !this.state.staticmessagesMenuOpen })} data-toggle="collapse">
            <i className="pe-7s-news-paper"></i>
            <p>Static Messages <b className="caret"></b></p>
          </a>
          <Collapse in={this.state.staticmessagesMenuOpen}>
            <div>
              <ul className="nav">
                <li className={this.isPathActive('/staticmessages/accordion') ? 'active' : null}>
                  <Link to="/staticmessages/accordion">Accordion</Link>
                </li>
                <li className={this.isPathActive('/staticmessages/catalog') ? 'active' : null}>
                  <Link to="/staticmessages/catalog">Catalog</Link>
                </li>
                <li className={this.isPathActive('/staticmessages/myinfo') ? 'active' : null}>
                  <Link to="/staticmessages/myinfo">My Info</Link>
                </li>
                
              </ul>
            </div>
          </Collapse>
        </li>
      </ul>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Nav);
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';


class Nav extends Component {
  staticPages = [];
  shippingAndHolidayPages =["shippingmaster"];
  page = "";

  getDataStaticPages = async() => {
    const api_call = await fetch("http://localhost:8080/staticpages/all");
    const data = await api_call.json();
    for (var item in data) {
      if (data[item].pagename !== null && data[item].pagename !== undefined) {
      this.staticPages.push(data[item].pagename); }
    }

    return null;
  }

  getDataShippingAndHoliday = async() => {
    const api_call = await fetch("http://localhost:8080/shippinginfos/all");
    const data = await api_call.json();
    for (var item in data) {
      if (data[item].id !== null && data[item].id !== undefined) {
      this.shippingAndHolidayPages.push(data[item].id); }
    }
    return null;
  }

  state = {}; 

  componentDidMount() {
    this.getDataStaticPages()
    }
  render() {
    let { location } = this.props;

    const listOfStaticPages = this.staticPages.map((staticPage) =>
        <li  
            key={staticPage.toString()} className={this.isPathActive(`/staticpages/${staticPage}`) ? 'active' : null}>
            <Link to={{pathname:`/staticpages/${staticPage}`}}> {staticPage.charAt(0).toUpperCase() + staticPage.slice(1)} </Link>
        </li>
        ); 

    const listOfShippingAndHoliday = this.shippingAndHolidayPages.map((shippingAndHolidayPage) =>
        <li  
            key={shippingAndHolidayPage.toString()} className={this.isPathActive(`/shippinginfos/${shippingAndHolidayPage}`) ? 'active' : null}>
            <Link to={{pathname:`/shippinginfos/${shippingAndHolidayPage}`}}> {shippingAndHolidayPage} </Link>
        </li>
        ); 
    return (
      <ul className="nav">
        <li className={location.pathname === '/' ? 'active' : null}>
          <Link to="/">
            <i className="pe-7s-graph"></i>
            <p>Dashboard</p>
          </Link>
        </li>
        <li  className={this.isPathActive('/shippinginfos') || this.state.shippingandholidayMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ shippingandholidayMenuOpen: !this.state.shippingandholidayMenuOpen })} data-toggle="collapse">
            <i className="pe-7s-news-paper"></i>
            <p> Shipping Informations <b className="caret"></b></p>
          </a>
          <Collapse in={this.state.shippingandholidayMenuOpen}>
            <div>
              <ul className="nav">
              {listOfShippingAndHoliday}
              </ul>
            </div>
          </Collapse>
        </li>
        <li   className={this.isPathActive('/staticpages') || this.state.staticpagesMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ staticpagesMenuOpen: !this.state.staticpagesMenuOpen })} data-toggle="collapse">
            <i className="pe-7s-news-paper"></i>
            <p> Static Messages <b className="caret"></b></p>
          </a>
          <Collapse in={this.state.staticpagesMenuOpen}>
            <div>
            <ul className="nav">
              {listOfStaticPages}
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
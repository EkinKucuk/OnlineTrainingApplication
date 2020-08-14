import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
import setAuthToken from '../../helpers/setAuthToken'


const defaultProps = {};



class DefaultHeader extends Component {

  constructor(){
    super();
  }

  logOut() {
    // remove user from local storage to log user out
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    this.props.history.push('/');
  }


  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 98, height: 32, alt: 'CoreUI Logo' }}
    
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Panel</NavLink>
          </NavItem>   
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink to="/kurslarım" className="nav-link">Kurslarım</NavLink>
          </NavItem>
<div><pre>  </pre></div>
          <NavItem className="d-md-down-none">
            <NavLink to = "/" onClick = {this.logOut} className="nav-link">Çıkış Yap</NavLink>
            
          </NavItem><div><pre>  </pre></div>
         
        </Nav>
        
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

export default DefaultHeader;

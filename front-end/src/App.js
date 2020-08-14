import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';
import axios from 'axios';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));


// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Logout = React.lazy(() => import('./views/Pages/Logout'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));
const ForgotPassword = React.lazy(() => import('./views/Pages/ForgotPassword/ForgotPassword'));



class App extends Component {

  render() {
    
    console.log(localStorage.getItem('jwtToken'));
    if( localStorage.getItem('jwtToken') && (axios.defaults.headers.common['Authorization'] == null && axios.defaults.headers.common['Authorization'] == undefined)){
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    }

    return (
        <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
        

            <Route exact path="/login" name="Login Page" render={props => 
            
            localStorage.getItem('jwtToken') ? (
                <Redirect to="/dashboard"/>
              ) : (
                <Login {...props} />
                
              )
                
            } />
            <Route exact path='/logout' name = "Logout" render = {props => <Logout {...props} />} />
            <Route exact path="/forgotpassword" name="Şifre Unuttum" render={props => <ForgotPassword {...props} />} />
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
            <Route path="/" name="Home" render={
              props => 
                localStorage.getItem('jwtToken') ? (
                  <DefaultLayout {...props}/>
                ) : (
                  <Redirect to="/login"/>
                )
            }  /> 
            
            
              
            </Switch>
          </React.Suspense>
        </BrowserRouter>
    );
  }
}

export default App;

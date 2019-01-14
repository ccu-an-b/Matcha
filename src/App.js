import React, { Component } from 'react';
import './App.css';
import {Provider} from 'react-redux';
import Header  from 'components/shared/Header' ;
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import { ProtectedRoute } from 'components/shared/auth/ProtectedRoute' ;
import { LoggedInRoute } from 'components/shared/auth/LoggedInRoute' ;

import * as actions from 'actions';

import Landing  from 'components/landing/Landing' ;
import Dashboard  from 'components/dashboard/Dashboard' ;
import Background from 'components/shared/Background';
const store = require('./reducers').init();


class App extends Component {

  componentWillMount(){
    this.checkAuthState();
  }

  checkAuthState(){
    store.dispatch(actions.checkAuthState());
  }
  logout(){
    store.dispatch(actions.logout());
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
        
          <div className="App">
          <LoggedInRoute exact path="/" component={Landing} />
          <LoggedInRoute exact path="/:key" component={Landing} />
          <ProtectedRoute exact path="/dashboard" component={Background} />
          <div className="app-container">
            <Header logout={this.logout}/>
              <Switch>
                <ProtectedRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
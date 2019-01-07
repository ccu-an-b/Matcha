import React, { Component } from 'react';
import './App.css';
import {Provider} from 'react-redux';
import Header  from 'components/shared/Header' ;
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import { ProtectedRoute } from 'components/shared/auth/ProtectedRoute' ;
import { LoggedInRoute } from 'components/shared/auth/LoggedInRoute' ;

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import * as actions from 'actions';

import Landing  from 'components/landing/Landing' ;
import Dashboard  from 'components/dashboard/Dashboard' ;

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
            <Header logout={this.logout}/>
            <div className="app-container">
              <Switch>
                <LoggedInRoute exact path="/" component={Landing} />
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
library.add(faTimes);
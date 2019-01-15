import React, { Component } from 'react';
import './App.css';
import {Provider} from 'react-redux';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import { ProtectedRoute } from 'components/shared/auth/ProtectedRoute' ;
import { LoggedInRoute } from 'components/shared/auth/LoggedInRoute' ;

import * as actions from 'actions';

import Header  from 'components/shared/Header' ;
import Navbar from 'components/shared/Navbar' ;
import Landing  from 'components/landing/Landing' ;
import Activation from 'components/activation/Activation' ;
import Background from 'components/shared/Background';
import Dashboard  from 'components/dashboard/Dashboard' ;
import Browse from 'components/browse/Browse' ;
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
          <Route exact path="/activation/:key" component={Activation} />
          <Background/>
          <div className="app-container">
            <Header logout={this.logout}/>
            {/* <Navbar logout={this.logout}/> */}
              <Switch>
                <ProtectedRoute exact path="/dashboard" component={Dashboard} />
                <ProtectedRoute exact path="/browse" component={Browse} />
                <ProtectedRoute exact path="/:key" component={Landing} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
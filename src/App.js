import React, { Component } from 'react';
import './App.css';
import {Provider} from 'react-redux';
import Header  from 'components/shared/Header' ;
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import * as actions from 'actions';

import Landing  from 'components/landing/Landing' ;

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
          <Header />
          <Route exact path='/' component={Landing} />
          {/* <Switch> */}
          {/* </Switch> */}
        </div>
      </BrowserRouter>
      </Provider>
    );
  }
}

export default App;

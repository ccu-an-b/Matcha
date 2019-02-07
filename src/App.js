import React, { Component } from 'react';
import './App.css';
import {Provider} from 'react-redux';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import "react-notifications-component/dist/theme.css";
import { ProtectedRoute } from 'components/shared/auth/ProtectedRoute' ;
import { LoggedInRoute } from 'components/shared/auth/LoggedInRoute' ;
import ReactNotification from "react-notifications-component";

import * as actions from 'actions';
import authService from 'services/auth-service';
import Header  from 'components/shared/Header' ;
import Landing  from 'components/landing/Landing' ;
import Activation from 'components/activation/Activation' ;
import Background from 'components/shared/Background';
import Dashboard  from 'components/dashboard/Dashboard' ;
import Browse from 'components/browse/Browse' ;
import Settings from 'components/settings/Settings' ;
import Profile  from 'components/profile/Profile' ;
import Notification from 'components/shared/notifications/Notification' ;
const store = require('./reducers').init();


class App extends Component {

  constructor(){
    super()
    this.notificationDOMRef = React.createRef();
  }

  componentWillMount(){
    this.checkAuthState();
    if (authService.isAuthentificated()){
      this.initStore()
    }
  }

  addNotification = (profile, type, message) => {
    this.notificationDOMRef.current.addNotification({
      message: message,
      insert: "top",
      container: "bottom-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 3000 },
      dismissable: { click: true },
      content: <Notification username="chloe" type={type} profile={profile} message={message}/>,
    });
  }
  checkAuthState(){
    store.dispatch(actions.checkAuthState());
  }

  logout(){
    store.dispatch(actions.logout())
  }


  initStore(){
    store.dispatch(actions.fetchPublicData());
    store.dispatch(actions.fetchUserProfile(authService.getUsername()))
    store.dispatch(actions.fetchTags())
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
            <ReactNotification ref={this.notificationDOMRef} />
              <Switch>
                <ProtectedRoute exact path="/dashboard" component={Dashboard} addNotification={this.addNotification}/>
                <ProtectedRoute exact path="/browse" component={Browse} addNotification={this.addNotification}/>
                <ProtectedRoute exact path="/settings" component={Settings} addNotification={this.addNotification}/>
                <ProtectedRoute exact path="/:key" component={Landing} />
                <ProtectedRoute exact path="/profile/:username" component={Profile} addNotification={this.addNotification} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
import React, { Component } from 'react';
import './App.css';

import Header  from 'components/shared/Header' ;
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import LoginRegister from './container/loginRegister/LoginRegister';

import {Route} from 'react-router-dom'
import ChatWithSocket from './container/chatwithsocket'


class App extends Component {
  render() {
   
    return (

      <div className="App">
        <Route path="/" exact component={ChatWithSocket} />
        <Route path="/Join" component={LoginRegister} />
      </div>

    );
  }
}

export default App;

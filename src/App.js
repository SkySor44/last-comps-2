import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor(){
    super()
    this.state = {
      data: []
    }
  }

  componentDidMount(){
    axios.get('http://localhost:3004/getendpoint').then(res => {
      this.setState({
        data: res.data
      })
    })
  }

  putEndpoint(){
    axios.put('http://localhost:3004/putendpoint').then(res => {
      this.setState({
        data: res.data
      })
      console.log(this.state.data)
    })
  }

  render() {

    var render = this.state.data.map((value, i) => {
      return (
        <div key = {i}>
          <p>{value}</p>
        </div>
      )
    })
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <a href= "http://localhost:3004/auth/callback">LOGIN</a>
        <br/>
        <button onClick = {() =>  this.putEndpoint()}>PUT ENDPOINT</button>
        {render}
      </div>
    );
  }
}

export default App;

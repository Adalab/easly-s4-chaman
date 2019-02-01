import React, { Component } from 'react';
import Daily from '../Daily';
import API from '../../weather'
import './App.scss';

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      Endpoint:API,
    }
  }
  
  render() {
    const {ResponseApi}=this.state;
    return (
      <div className='App'>
        Chamán
        <Daily/>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
    }
  }
  componentWillMount() {
    axios.get('https://wfc-2019.firebaseapp.com/images?limit=10000&offset=')
         .then(res => {
           this.setState({ images: res.data.data.images });
         });
  }

  renderUsers(image) {
    return (
      <div style={{ border: 'solid 1px #eee' }}>
        <img src={image.url} alt={image.title} width="50" height="50" />
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <div>{this.state.images.map(image => this.renderUsers(image))}</div>
      </div>
    );
  }
}

export default App;

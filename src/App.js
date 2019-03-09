import React, { Component } from 'react';
import axios from 'axios';
import Gallery from 'react-grid-gallery';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
    }
  }
  componentWillMount() {
    axios.get('https://wfc-2019.firebaseapp.com/images?limit=200&offset=')
         .then(res => {
          const images = res.data.data.images.map(image => (
            {
              src: image.url,
              thumbnail: image.url,
              thumbnailWidth: image.width / 10,
              thumbnailHeight: image.height / 10,
              caption: image.description,
              alt: image.title
            }
          ));
           this.setState({ images: images });
         });
  }

  render() {
    return (
      <div>
        <Gallery
          images={this.state.images}
          enableImageSelection = {false}
        />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import axios from 'axios';
import Gallery from 'react-grid-gallery';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
    }
    this.deleteImage = this.deleteImage.bind(this);
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

  deleteImage() {
    if (window.confirm(`Are you sure you want to delete image number ${this.state.currentImage}?`)) {
        const images = this.state.images.slice();
        images.splice(this.state.currentImage, 1)
        this.setState({
            images: images
        });
    }
  }

  render() {
    const hashtags = ['ca_wfc'];
    return (
      <div>
        <TwitterShareButton url={'https://github.com/benhowell/react-grid-gallery'} />
        <Gallery
          images={this.state.images}
          enableImageSelection = {false}
          customControls={[
            <TwitterShareButton 
              title='myalbum' 
              via='matamatak05' 
              url='https://takumon.com/2018/09/16/' 
              hashtags={hashtags}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          ]}
        />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import axios from 'axios';
import Gallery from 'react-grid-gallery';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      currentImage: 0
    }
    this.onCurrentImageChange = this.onCurrentImageChange.bind(this);
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

  onCurrentImageChange(index, image) {
    this.setState({ currentImage: index });
  }

  deleteImage() {
    if (window.confirm(`本当に${this.state.currentImage + 1}番目の画像を消してもよろしいですか?`)) {
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
        <Gallery
          images={this.state.images}
          enableImageSelection = {false}
          showLightboxThumbnails
          currentImageWillChange={this.onCurrentImageChange}
          customControls={[
            <TwitterShareButton 
              key={'twitter' + this.state.currentImage}
              title='myalbum' 
              via='matamatak05' 
              url='https://my-album-2e4a9.firebaseapp.com/'
              hashtags={hashtags}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>,
            <button key={'delete' + this.state.currentImage} onClick={this.deleteImage}>Delete Image</button>,
          ]}
        />
      </div>
    );
  }
}

export default App;

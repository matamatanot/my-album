import React, { Component } from 'react';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import TimeAgo from 'react-timeago';
import axios from 'axios';
import Gallery from 'react-grid-gallery';
import GoogleMapLogo from './Google Maps.svg';
import Trash from './icons8-waste-48.png';
import japaneseStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import './App.css';

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
              alt: image.title,
              lat: image.location.lat,
              lng: image.location.lng,
              postDatetime: image.postDatetime
            }
          ));
           this.setState({ images: images });
         });
  }

  onCurrentImageChange(index) {
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
    const cureentImage = this.state.images[this.state.currentImage] 
      || {src: '',
          thumbnail: '',
          thumbnailWidth: '',
          thumbnailHeight: '',
          caption: '',
          alt: '',
          lat: '',
          lng: '',
          postDatetime: ''
        };
    const mapClick = () => {
      const mapUrl = `https://www.google.com/maps?q=${cureentImage.lat},${cureentImage.lng}`
      const win = window.open(mapUrl, '_blank');
      win.focus();
    } 
    const formatter = buildFormatter(japaneseStrings);
    return (
      <div>
        <header className="App-header">
          <p>Grid Gallery</p>  
        </header>
        <Gallery
          images={this.state.images}
          enableImageSelection = {false}
          showLightboxThumbnails
          currentImageWillChange={this.onCurrentImageChange}
          customControls={[
            <TwitterShareButton 
              key={'twitter' + this.state.currentImage}
              title='Web Frontend Challengeのテストツイートです' 
              via='matamatak05' 
              url={cureentImage.src}
              hashtags={['ca_wfc']}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>,
            <img src={GoogleMapLogo} alt="map" onClick={() => mapClick()} ></img>,
            <img src={Trash} alt="trash" onClick={this.deleteImage} ></img>,
            <TimeAgo date={cureentImage.postDatetime} formatter={formatter} />,
          ]}
        />
      </div>
    );
  }
}

export default App;

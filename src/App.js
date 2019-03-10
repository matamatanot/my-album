import React, { Component } from 'react';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import TimeAgo from 'react-timeago';
import axios from 'axios';
import Gallery from 'react-grid-gallery';
import GoogleMapLogo from './icons/google-maps-svg.svg';
import Trash from './icons/icons8-waste-48.png';
import japaneseStrings from 'react-timeago/lib/language-strings/ja'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      loadedImage: 0,
      currentImage: 0,
      maxLoaded: false
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
              caption: image.title,
              alt: image.title,
              lat: image.location.lat,
              lng: image.location.lng,
              postDatetime: image.postDatetime
            }
          ));
           this.setState({ images: images });
           this.setState({ loadedImage: 200 });
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
    const nextClick = () => {
      axios.get(`https://wfc-2019.firebaseapp.com/images?limit=200&offset=${this.state.loadedImage}`)
         .then(res => {
          const images = res.data.data.images.map(image => (
            {
              src: image.url,
              thumbnail: image.url,
              thumbnailWidth: image.width / 10,
              thumbnailHeight: image.height / 10,
              caption: image.title,
              alt: image.title,
              lat: image.location.lat,
              lng: image.location.lng,
              postDatetime: image.postDatetime
            }
          ));
          if (images.length > 0) {
            this.setState({ images: this.state.images.concat(images) });
            this.setState({ loadedImage: this.state.loadedImage + 200 });
          }else{
            this.setState({ maxLoaded: true });
          }
         });
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
          backdropClosesModal
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
            <img src={GoogleMapLogo} alt="map" onClick={() => mapClick()} width='32' height='32' ></img>,
            <img src={Trash} alt="trash" onClick={this.deleteImage} width='39' height='39'></img>,
            <TimeAgo date={cureentImage.postDatetime} formatter={formatter} />,
          ]}
        />
        {!this.state.maxLoaded && <button onClick={() => nextClick()} width='32' height='32' >次読み込むよ</button>}
        {this.state.maxLoaded && <button onClick={() => nextClick()} width='32' height='32' >もう読み込めないよ 間に合わなかったよ</button>}
      </div>
    );
  }
}

export default App;

import React from 'react';
import './ListingDetail.css';

class ListingDetail extends React.Component {
  state = {
    listing: null,
    selectedImage: 0,
  };

  componentDidMount() {
    fetch('/listing/' + this.props.match.params.id)
      .then(response => response.json())
      .then(listing => this.setState({ listing }));
  }

  selectImage = index => this.setState({ selectedImage: index })

  selectNext = ()=> this.setState({
    selectedImage: (this.state.selectedImage + 1) % this.state.listing.images.length
  })

  selectPrev = ()=> this.setState({
    selectedImage: (
      this.state.selectedImage - 1 + this.state.listing.images.length
    ) % this.state.listing.images.length
  })

  render() {
    const { listing, selectedImage } = this.state;

    if( !listing ) return (<div/>);

    return (
      <div className="ListingDetail">
        <h2>{listing.title} - ${listing.price}</h2>

        <div style={{ backgroundImage: `url(${ listing.images[selectedImage] })` }}
             className='detail-image'>
          <div className='arrow-left' onClick={this.selectPrev}>‹</div>
          <div className='arrow-right' onClick={this.selectNext}>›</div>
        </div>

        <div className='thumbnail-container'>
          {
            listing.images.map((image, i)=> (
              <div key={i}
                   onMouseEnter={()=> this.selectImage(i)}
                   onClick={()=> this.selectImage(i)}
                   style={{ backgroundImage: `url(${image})` }}
                   className={'thumbnail '+(selectedImage === i ? 'selected' : '')}/>
            ))
          }
        </div>

        <p>{listing.description}</p>
      </div>
    );
  }
}

export default ListingDetail;

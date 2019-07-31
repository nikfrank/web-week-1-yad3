import React from 'react';

class MakeListing extends React.Component {

  state = {
    title: '',
    description: '',
    price: 0,
    images: [],
  }

  setTitle = e => this.setState({ title: e.target.value })
  setDescription = e => this.setState({ description: e.target.value })
  setPrice = e => this.setState({ price: 1*e.target.value })

  addImage = ()=> this.setState({
    images: [...this.state.images, ''],
  })

  deleteImage = i=> this.setState({
    images: [
      ...this.state.images.slice(0, i),
      ...this.state.images.slice(i+1),
    ],
  })

  setImage = (e, i)=> this.setState({
    images: [
      ...this.state.images.slice(0, i),
      e.target.value,
      ...this.state.images.slice(i+1),
    ],
  })

  render(){
    return (
      <div className='MakeListing'>
        <label>
          <span>Title</span>
          <input value={this.state.title} onChange={this.setTitle} />
        </label>

        <label>
          <span>Description</span>
          <textarea value={this.state.description}
                    onChange={this.setDescription} />
        </label>

        <label>
          <span>Price ($)</span>
          <input value={this.state.price} onChange={this.setPrice}
                 type='number' />
        </label>

        {
          this.state.images.map((imageUrl, i)=> (
            <label key={this.state.images.length + '-' + i}>
              <span>Image Url</span>
              <input value={this.state.images[i]}
                     onChange={e=> this.setImage(e, i)} />
              <button onClick={()=> this.deleteImage(i)}>X</button>
            </label>
          ))
        }
        <button onClick={this.addImage}>+</button>

        <button onClick={this.submit}>Create Listing</button>
      </div>
    );
  }
}

export default MakeListing;

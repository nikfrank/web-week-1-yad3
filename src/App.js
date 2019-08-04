import React from 'react';
import './App.css';

import MakeListing from './MakeListing';
import Listings from './Listings';
import Login from './Login';

class App extends React.Component {

  state = {
    listings: [],
    token: null,
  }

  componentDidMount(){
    this.reload();
  }

  reload = ()=> fetch('/listing')
    .then(response => response.json())
    .then(listings => this.setState({ listings }))

  setToken = token => this.setState({ token })

  render() {
    return (
      <div className='App'>
        <Listings listings={this.state.listings} />
        {this.state.token ? (
          <MakeListing triggerReload={this.reload} token={this.state.token}/>
        ) : (
          <Login onLogin={this.setToken} />
        )}
      </div>
    );
  }
}

export default App;

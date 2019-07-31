import React from 'react';
import './App.css';

import MakeListing from './MakeListing';
import Listings from './Listings';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Listings />
        <MakeListing />
      </div>
    );
  }
}

export default App;

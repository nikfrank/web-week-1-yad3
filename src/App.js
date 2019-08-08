import React from 'react';
import './App.css';

import MakeListing from './MakeListing';
import Listings from './Listings';
import Login from './Login';
import ListingDetail from './ListingDetail';
import Checkout from './Checkout';

import ShoppingCartIcon from './ShoppingCartIcon';

import { subscribe } from './shoppingCart';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';


class Navbar extends React.Component {

  state = {
    shoppingCartLength: 0,
  }

  componentDidMount(){
    subscribe('items', items =>
      this.setState({ shoppingCartLength: items.length }));
  }

  render(){
    return (
      <div className='Navbar'>
        <Link to='/'>
          <h1>YAD3</h1>
        </Link>

        <Link to='/checkout'>
          <ShoppingCartIcon className='ShoppingCartIcon'
                            number={this.state.shoppingCartLength} />
        </Link>
      </div>
    );
  }
};

class AdminPage extends React.Component {
  render(){
    return (
      <div className='AdminPage'>
        I am an admin, I am important
      </div>
    );
  }
};


class App extends React.Component {

  state = {
    listings: [],
    token: null,
    isAdmin: false,
  }

  componentDidMount(){
    this.reload();
  }

  reload = ()=> fetch('/listing')
    .then(response => response.json())
    .then(listings => this.setState({ listings }))

  setToken = token => this.setState({ token }, ()=> {
    fetch('/checkAdmin', {
      headers: { Authorization: 'Bearer '+token }
    }).then(({ status })=> {
      this.setState({ isAdmin: status === 200 })
    })
  })

  togglePanel = ()=> this.setState(state => ({ panelOpen: !state.panelOpen }))

  render() {
    return (
      <Router>
        <div className='App'>
          <Navbar />

          {this.state.isAdmin ? (
            <div className='admin-link'>
              <Link to='/admin'>ADMIN</Link>
              <Link to='/'>HOME</Link>
            </div>
          ) : null }

          <div className={'toggle-panel '+(this.state.panelOpen ? 'reversed' : '')}
               onClick={this.togglePanel}>
            ⌃
          </div>

          <div className='content'>
            <div style={{ height: (this.state.panelOpen ? 70 : 90)+'%' }}>
              <Switch>
                <Route exact path='/listings' render={()=> (
                    <Listings listings={this.state.listings}/>
                  )}/>
                <Route exact path='/listing/:id' component={ListingDetail} />
                <Route exact path='/checkout' component={Checkout} />

                {this.state.isAdmin ? (
                  <Route exact path='/admin' component={AdminPage} />
                ) : null}

                <Redirect from='/' to='/listings'/>
              </Switch>
            </div>

            <div style={{ height: (this.state.panelOpen ? 30 : 10)+'%' }}>
              {this.state.token ? (
                <MakeListing triggerReload={this.reload} token={this.state.token}/>
              ) : (
                <Login onLogin={this.setToken} />
              )}
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

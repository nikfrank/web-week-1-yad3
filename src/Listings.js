import React from 'react';
import house from './house.png';

import { Link } from 'react-router-dom';

class Listings extends React.Component {
  state = {
    searchText: '',
    minPrice: 0,
    maxPrice: 25000,
    priceSort: null, // 'up', 'dn'
  };

  setSearchText = event => {
    this.setState({
      searchText: event.target.value,
    });
  };

  setMinPrice = event => this.setState({minPrice: event.target.value});
  setMaxPrice = event => this.setState({maxPrice: event.target.value});

  setNextSort = () =>
    this.setState({
      priceSort: !this.state.priceSort
        ? 'up'
        : this.state.priceSort === 'up' ? 'dn' : null,
    });

  render() {
    return (
      <div className="Listings">
        <div className="search">
          <label>
            Search
            <input
              value={this.state.searchText}
              placeholder="Search"
              onChange={this.setSearchText}
            />
          </label>

          <label>
            Min Price
            <input
              value={this.state.minPrice}
              type="number"
              step={100}
              onChange={this.setMinPrice}
            />
          </label>

          <label>
            Max Price
            <input
              value={this.state.maxPrice}
              type="number"
              step={100}
              onChange={this.setMaxPrice}
            />
          </label>

          <button onClick={this.setNextSort}>
            {this.state.priceSort || 'sort'}
          </button>
        </div>

        <ul>
          {this.props.listings
            .filter(
              listing =>
                !this.state.searchText ||
                listing.title
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase()),
            )
            .filter(
              listing =>
                this.state.minPrice <= listing.price &&
                this.state.maxPrice >= listing.price,
            )
            .sort(
              (a, b) =>
                this.state.priceSort === 'dn'
                  ? a.price > b.price ? 1 : -1
                  : this.state.priceSort === 'up'
                      ? a.price > b.price ? -1 : 1
                      : 0,
            )
            .sort(
              (a, b) =>
                !this.state.priceSort
                  ? 0
                  : a.price > b.price
                      ? this.state.priceSort === 'dn' ? 1 : -1
                      : this.state.priceSort === 'dn' ? -1 : 1,
            )
            .map(listing => (
              <li className="listing" key={listing.id}>
                <img
                  alt=""
                  src={(listing.images && listing.images[0]) || house}
                />
                <div>
                  <span className="date">
                    {new Date(listing.createdAt)
                      .toString()
                      .slice(4, 10)
                      .replace(' 0', ' ')}
                  </span>
                  <Link to={'/listing/'+listing.id}>{listing.title}</Link>
                  <div className="price">
                    <span>${listing.price}</span>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default Listings;

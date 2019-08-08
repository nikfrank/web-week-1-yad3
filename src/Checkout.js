import React from 'react';
import './Checkout.css';

import { subscribe, getValue } from './shoppingCart';

class Checkout extends React.Component {
  state = {
    uniqueItems: [],
  }

  componentDidMount(){
    this.unsubscribe = subscribe('items', this.onNewItems);
    this.onNewItems();
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  onNewItems = ()=> {
    const items = getValue('items') || [];

    const uniqueItems = {};
    for(let i=0; i < (items.length); i++ ){
      if( !uniqueItems[ items[i].id ] ){
        uniqueItems[ items[i].id ] = { count: 0, ...items[i] };
      }

      uniqueItems[ items[i].id ].count += 1;
    }

    this.setState({
      uniqueItems: Object.keys(uniqueItems).sort().map(k=> uniqueItems[k]),
    });
  }

  render(){
    return (
      <div className='Checkout'>
        <div className='items-container'>
          <div className='header-row'>
            <div>Title</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Total Price</div>
          </div>
          <ul className='items'>
            {this.state.uniqueItems.map((item, i)=> (
              <li key={i}>
                <div>{item.title}</div>
                <div>{item.count}</div>
                <div>${item.price}</div>
                <div>${item.count * item.price}</div>
              </li>
            ) )}
          </ul>
          <div className='total-price'>
            Total Price: ${
              this.state.uniqueItems
                .reduce((total, item)=> total + item.price * item.count, 0)
            }
          </div>
        </div>
      </div>
    );
  }
};

export default Checkout;

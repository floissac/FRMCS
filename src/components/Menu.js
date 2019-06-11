import React, { Component } from 'react';
import './style.scss';

export default class Menu extends Component {
  render() {
    return (
      <nav>
         <div className="frmcs-nav ">
        <div className="frmcs-nav-text">Floissac Receivables Management & Consulting</div>
        </div>
        <div className="menu">
        <div className="menu__item">
            <a href="/index.html">Home</a>
        </div>
        <div className="menu__item">
           <a href="/products/product-1.html">Product</a>
        </div>
        <div className="menu__item">
        <a href="/contact.html">Contact</a>
        </div>
        </div>
      </nav> 
    );
  }
}

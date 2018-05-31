import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import StatWranglerApp from './layouts/StatWranglerApp';

window.addEventListener('load', () => {
  ReactDOM.render((
    <StatWranglerApp />
  ), window.document.getElementById('react-app'));
});

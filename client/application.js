import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { DataProvider, DataManager } from 'react-data-actions';
import createBrowserHistory from 'history/createBrowserHistory';

import MonocleApp from './layouts/MonocleApp';

const history = createBrowserHistory();

window.addEventListener('load', () => {
  const dataManager = DataManager.getInstance();

  ReactDOM.render((
    <DataProvider dataManager={ dataManager }>
      <MonocleApp />
    </DataProvider>
  ), window.document.getElementById('react-app'));

  history.listen((location) => {
    const path = location.pathname.substr(1);
  });
});

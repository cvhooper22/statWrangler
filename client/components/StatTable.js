import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stat Labels from '../assets/statLabels.json';

export default class StatTable extends Component {
  static propTypes = {
    stats: PropTypes.array,
  }

  render () {
    return (
      <div className="stat-table">
        { this.renderHeader() }
        { this.renderRows() }
      </div>
    );
  }

  renderHeader () {
    const 
  }

  renderRows () {
    return this.stats.map((statRow) => {

    });
  }
}

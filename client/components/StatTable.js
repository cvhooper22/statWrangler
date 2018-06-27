import React, { Component } from 'react';
import get from 'lodash';
import PropTypes from 'prop-types';
import statLabels from '../helpers/statLabels.json';

export default class StatTable extends Component {
  static propTypes = {
    stats: PropTypes.array,
  }

  render () {
    return (
      <div className="stat-table">
        { this.renderHeader() }
        <div className="stat-table__body">
          { this.renderRows() }
        </div>
      </div>
    );
  }

  renderHeader () {
    if (!this.props.stats.length) { return undefined; }
    const availableStats = Object.keys(this.props.stats[0]);
    const headerCells = availableStats.map((header) => {
      const label = statLabels[header] || header;
      return <div key={ header } className="stat-table__header__cell default-pad">{ label }</div>;
    });
    return (
      <div className="stat-table__header flex">
        { headerCells }
      </div>
    );
  }

  renderRows () {
    if (!this.props.stats.length) { return undefined; }
    return this.props.stats.map((statRow, i) => {
      const statKeys = Object.keys(statRow);
      const stats = statKeys.map((statKey) => {
        return <div key={ statKey } className="stat-table__row__cell default-pad">{ statRow[statKey] }</div>;
      });
      return (
        <div className="stat-table__row flex" key={ i }>
          { stats }
        </div>
      );
    });
  }
}

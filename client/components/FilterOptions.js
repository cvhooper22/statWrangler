import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterOptionSelector from './FilterOptionSelector';

export default class FilterOptions extends Component {
  static propTypes = {
    onFiltersChanged: PropTypes.func,
  };

  state = { filters: [] };

  onFilterSaved = (option) => {
    console.log('the filter has been saved', option);
  }

  onAddFilter = () => {
    const filters = this.state.filters.slice(0);
    filters.push({ name: 'Pick an Option '});
    this.setState({ filters });
  }

  render () {
    return (
      <div className="filter-options">
        { this.renderFilterOptions() }
        <button type="button" onClick={ this.onAddFilter }>Add Filter</button>
      </div>
    );
  }

  renderFilterOptions () {
    if (this.state.filters.length) {
      return (
        <div className="filter-options__filters">
          {
            this.state.filters.map((filter, i) => <FilterOptionSelector key={ i } option={ filter } onOptionSelect={ this.onAddFilter } />)
          }
        </div>
      );
    }
    return undefined;
  }
}

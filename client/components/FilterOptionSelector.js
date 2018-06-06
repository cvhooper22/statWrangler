import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';
import filterOptions from '../assets/filterOptions.json';

const compareOptions = [
  {
    name: '=',
    value: 'equal',
  },
  {
    name: '>',
    value: 'greater',
  },
  {
    name: '<',
    value: 'less',
  },
];

export default class FilterOptionSelector extends React.Component {
  static propTypes = {
    onOptionSelect: PropTypes.func,
  };

  state = { currentOption: {}, };

  onOptionChange = (option) => {
    console.log('optionChanged, here it is', option);
    this.setState({ currentOption: option });
  }

  onFilterValueChange = (option) => {
    console.log('the filter value has changed', option);
  }

  onSaveClick = (evt) => {
    evt.preventDefault();
    console.log('use this filter!');
  }

  render () {
    return (
      <div className="filter-option-row flex">
        { this.renderParentOption() }
        { this.renderSecondaryOptions() }
        { this.renderSaveButton() }
      </div>
    )
  }

  renderParentOption () {
    const placeholder = this.state.currentOption.name || 'Choose a filter';
    return (
      <Dropdown
        items={ filterOptions }
        itemToString={ item => item.name }
        placeholder={ placeholder }
        onChange={ this.onOptionChange }
      />
    );
  }

  renderSecondaryOptions () {
    if (Object.keys(this.state.currentOption).length < 1) {
      return undefined;
    }
    const options = this.state.currentOption.subValues || compareOptions;
    return (
      <Dropdown
        items={ options }
        itemToString={ item => item.name }
        placeholder={ 'Select Value' }
        onChange={ this.onFilterValueChange }
      />
    );
  }

  renderSaveButton () {
    const enabled = this.state.currentFilter;
    return <button type="button" onClick={ this.onSaveClick } disabled={ !enabled }>Set Filter</button>
  }
}  
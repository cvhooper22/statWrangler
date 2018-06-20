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
    onOptionSave: PropTypes.func,
    onOptionRemove: PropTypes.func,
    option: PropTypes.object,
  };

  constructor (props, ...args) {
    super(props, ...args);
    this.state = {
      currentOption: props.option || {},
      currentOptionValue: {},
    };
  }

  onOptionChange = (option) => {
    console.log('optionChanged, here it is', option);
    this.setState({ currentOption: option });
  }

  onFilterValueChange = (option) => {
    console.log('the filter value has changed', option);
    this.setState({ currentOptionValue: option });
  }

  onSaveClick = (evt) => {
    evt.preventDefault();
    console.log('use this filter!');
  }

  onRemoveClick = () => {
    if (this.props.onOptionRemove) {
      this.props.onOptionRemove(this.state.currentOption);
    }
  }

  render () {
    return (
      <div className="filter-option-row flex">
        { this.renderParentOption() }
        { this.renderSecondaryOptions() }
        { this.renderInput() }
        { this.renderSaveButton() }
        <button type="button" onClick={ this.onRemoveClick }>Remove</button>
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
    const options = this.state.currentOption.subValues || compareOptions;
    let placeholder = this.state.currentOption.subValues ? 'Select Value' : 'Select A Modifier';
    if (this.state.currentOptionValue) {
      placeholder = this.state.currentOptionValue.name;
    }
    return (
      <Dropdown
        items={ options }
        itemToString={ item => item.name }
        placeholder={ placeholder }
        onChange={ this.onFilterValueChange }
      />
    );
  }

  renderInput () {
    if (this.state.currentOptionValue && (compareOptions.indexOf(this.state.currentOptionValue) > -1)) {
      return <input type="number" ref={ n => this.input = n } />;;
    }
    return undefined;
  }

  renderSaveButton () {
    const enabled = this.state.currentFilter;
    return <button type="button" onClick={ this.onSaveClick } disabled={ !enabled }>Set Filter</button>;
  }
}  
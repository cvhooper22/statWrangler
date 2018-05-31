import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';

const defaultRender = (item, itemProps, isHighlighted, isSelected, stringifiedItem) => {
  const classes = [
    'pad-small',
    'cursor-pointer',
    'dropdown__options__option',
    isHighlighted && 'dropdown__options__option--highlighted',
    isSelected && 'bold dropdown__options__option--selected',
  ].filter(Boolean);
  return (
    <div
      key={ stringifiedItem }
      className={ classes.join(' ') }
      { ...itemProps }
    >
      { stringifiedItem }
    </div>
  );
};

const Dropdown = ({
  items,
  itemToString,
  onChange,
  placeholder,
  className,
  renderItem,
}) => (
  <Downshift
    itemToString={ itemToString }
    onChange={ onChange }
    render={ ({
      getToggleButtonProps,
      getItemProps,
      highlightedIndex,
      isOpen,
      selectedItem,
      itemToString: itemToStringOrDefault,
    }) => (
      <div className={ ['flex', 'ai-baseline', 'relative', className, 'dropdown', isOpen && 'dropdown--open'].filter(Boolean).join(' ') }>
        <button className="flex mx-small dropdown__toggle" { ...getToggleButtonProps() }>
          <span>{ placeholder || 'Select An Option' }</span>
          <i className="chevron--down" />
        </button>
        { isOpen && (
          <div className="absolute dropdown__options">
            { 
              items.map((item, i) => renderItem(
                item,
                getItemProps({ item }),
                i === highlightedIndex,
                item === selectedItem,
                itemToStringOrDefault(item),
              ))
            }
          </div>
        ) }
      </div>
    )}
  />
);

Dropdown.propTypes = {
  items: PropTypes.array.isRequired,
  itemToString: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  renderItem: PropTypes.func,
};

Dropdown.defaultProps = {
  renderItem: defaultRender,
};

export default Dropdown;
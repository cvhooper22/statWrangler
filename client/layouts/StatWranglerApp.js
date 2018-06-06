import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Image,
  Tooltip,
  Slider
} from 'transcend-react';
import MentionCard from '../components/MentionCard';
import Dropdown from '../components/Dropdown';
import FilterOptionSelector from '../components/FilterOptionSelector';
import mentions from '../assets/data.json';
import filterOptions from '../assets/filterOptions.json';

const MENTION_URL = "http://nuveye-hackathon.knex.deis.nuviapp.com/monitors/927f1489-01ae-46c6-b837-134567207713";

/*
if I map these to a boolean array (the results of the filter) then .filter(Boolean) I can see if a stat passes
const filterOptions = [
  {
    filterKey: 'fg2a',
    equal: false,
    greater: false,
    less: true, or could be a function where you pass in params and then 
  },
  {
  
  }
];
*/


export default class StatWranglerApp extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount () {
    // fetch('https://cors-anywhere.herokuapp.com/' + MENTION_URL)
    //   .then(response => response.json())
    //   .then((data) => {
    //     const myMentions = data.slice(0, 149);
    //     this.setState({ mentions: myMentions });
    //   })
    //   .catch(thing => console.log('the thing', thing));
  }

  render () {
    return (
      <div className={ this.state.imageViewerOpen ? 'image-viewer-open' : ''}>
        <div className="selectors section">
          <Dropdown
            items={ [{ name: 'Eli'}, { name: 'Payton'}, { name: 'Evan'}] }
            itemToString={ item => item.name }
            placeholder={ 'Pick a Player' }
          />
        </div>
        <div className="qualifiers section">
          Here are some qualifiers
          <FilterOptionSelector />
        </div>
        <div className="team-stats section">
          These are the team stats
        </div>
        <div className="player-stats section">
          Here are the resulting player stats
        </div>
      </div>
    );
  }
}

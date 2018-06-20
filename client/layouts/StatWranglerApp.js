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
import FilterOptions from '../components/FilterOptions';
import PlayerStats from '../components/PlayerStats';
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
    this.state = {
      players: [],
      filters: [],
      teamStats: [],
      playerStats: [],
      currentPlayer: {},
    };
  }

  componentDidMount () {
    fetch('http://localhost:3666/team_roster/brigham-young')
      .then(response => response.json())
      .then((data) => {
        this.setState({ players: data });
      })
      .catch(thing => console.log('the error', thing));
  }

  onPlayerPicked = (player) => {
    this.setState({ currentPlayer: player });
  }

  render () {
    return (
      <div className={ this.state.imageViewerOpen ? 'image-viewer-open' : ''}>
        <div className="selectors section">
          <Dropdown
            items={ this.state.players }
            itemToString={ item => item.name }
            placeholder={ 'Pick a Player' }
            onChange={ this.onPlayerPicked }
          />
        </div>
        <div className="team-stats section">
          These are the team stats
        </div>
        <div className="qualifiers section">
          Here are some qualifiers
          <FilterOptions />
        </div>
        <PlayerStats player={ this.state.currentPlayer } />
      </div>
    );
  }
}

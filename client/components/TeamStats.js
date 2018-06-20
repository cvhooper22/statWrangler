import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TeamStats extends Component {
  static propTypes = {
    teamId: PropTypes.string.isRequired,
  };

  state = {
    stats: [],
  };

  componentDidMount () {
    if (this.props.teamId) {
      fetch(`http://localhost:3666/team_logs/${this.props.teamId}`)
        .then(response => response.json())
        .then((data) => {
          this.setState({ players: data });
        })
        .catch(thing => console.log('the error', thing));
    }
  }  
}

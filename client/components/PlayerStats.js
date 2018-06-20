import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PlayerStats extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
  }

  state = { stats: [] };

  componentDidUpdate () {
    console.log('stats?', this.state.stats.length);
    if (!this.state.stats.length && this.props.player.id) {
      console.log('fetch it');
      fetch(`http://localhost:3666/player_logs/${this.props.player.id}`)
        .then(response => response.json())
        .then((data) => {
          this.setState({ stats: data });
        })
        .catch(thing => console.log('the error', thing));
    }
  }  

  render () {
    return (
      <div className="team-stats section">
        These are the team stats
      </div>
    );
  }  
}

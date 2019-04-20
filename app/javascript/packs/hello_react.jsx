// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // id: props.id,
      team: props.team
    }
    // this.handleNameChange = this.handleNameChange.bind(this);
    // this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
    // https://stackoverflow.com/questions/30148827/this-is-undefined-inside-map-function-reactjs
  }

  handleNameChange = () => {
    var team = {...this.state.team };
    team.name = event.target.value;
    this.setState({ team })
  }

  handlePlayerNameChange = (index) => {
    // debugger;
    var team = {...this.state.team };
    team.players_attributes[index].name = event.target.value;
    this.setState({ team })
  }

  addPlayer = () => {
    var team = {...this.state.team };
    team.players_attributes.push({
      id: null,
      name: "",
      _destroy: null
    })
    this.setState({ team })
  }

  removePlayer = (index) => {
    var team = {...this.state.team };
    var player = team.players_attributes[index];

    if (player.id == null) {
      team.players_attributes.splice(index, 1);
    } else {
      player._destroy = 1;
    }
    this.setState({team})
  }

  undoRemovePlayer = (index) => {
    var team = {...this.state.team };
    var player = team.players_attributes[index];
    player._destroy = null;
    this.setState({team});
  }

  saveTeam = () => {
    var teamJSON = this.state.team;

    if (this.props.id == null) {
      const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
      return fetch(`/teams.json`, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrf,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({team: teamJSON})
      }).then(response => {
        return response.json();
      }).then(data => {
        Turbolinks.visit(`/teams/${data.id}`);
      })

    } else {
      const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
      return fetch(`/teams/${this.props.id}.json`, {
        method: 'PUT',
        headers: {
          'X-CSRF-Token': csrf,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({team: teamJSON})
      }).then(response => {
        return response.json();
      }).then(data => {
        Turbolinks.visit(`/teams/${data.id}`);
      })
    }
  }

  render() {
    var players = this.state.team.players_attributes;
    var playersComponent = players.map((player, index) => {
      return (
        <div key={index}>
        { player._destroy != 1 &&
          <div>
            <label>Player Name</label>
            <input type="text"  value={player.name} onChange={(e) => this.handlePlayerNameChange(index) }/>
            <button onClick={(e) => this.removePlayer(index) }>Remove</button>
          </div>
        }
        { player._destroy == 1 &&
          <div>
            {player.name} will be removed.
            <button onClick={(e) => this.undoRemovePlayer(index) }> Undo </button>
          </div>
        }
        </div>
      )
    })
    return (
      <div>
        <label>Team Name</label>
        <input type="text" value={this.state.team.name} onChange={this.handleNameChange} />

        <h4>Players</h4>

        { playersComponent }

        <button onClick={this.addPlayer}>Add Player</button>

        <br />

        <button onClick={this.saveTeam}>Save Team</button>

      </div>
    )
  }
}

document.addEventListener('turbolinks:load', () => {
  var element = document.getElementById("team-form");

  // if #team-form exists, invoke React microApp
  if (element != null) {
    var id = element.dataset.id; // added due to strong params; match to rails strong params
    // when the page is loaded, the json of the rails object is already inside the #team-form div
    var team = JSON.parse(element.dataset.team); // grab the team json attribute and parse it out
      // data-team = {id: null, name: null}
    var players_attributes = JSON.parse(element.dataset.playersAttributes); // camel case to access properly, weird quirk
      // data-players-attributes = []
    players_attributes.forEach(function(player) { player._destroy = null }); // so we can set up automatically to have _destroy when we have edit form to be able to monitor with vue,

    // low key a clutch move in mirroring rails has_many/nested_attributes relations
    team.players_attributes = players_attributes;


    ReactDOM.render(
      <Team id={id} team={team} />,
      element,
    )
  }
})

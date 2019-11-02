import React, { Component } from 'react';
import sdk from 'matrix-js-sdk';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      isClientReady: false,
    };
  }

  setupClient = client => {
    this.setState({client: client});
    client.startClient();
    client.once('sync', (state, prevState, res) => {
      console.log(state);
      this.setState({isClientReady: true});
    });
  }

  render() {
    return (
      this.state.isClientReady ? <Chat client={this.state.client}/> : <Login setupClient={this.setupClient} />
    )
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server: "https://matrix.org",
      username: '',
      password: '',
    };
  }

  handleChange = event => this.setState({[event.target.id]: event.target.value});

  handleSubmit = event => {
    const client = sdk.createClient(this.state.server);
    client.login("m.login.password", {"user": this.state.username, "password": this.state.password})
      .then(response => this.props.setupClient(client))
      .catch(err => alert(err.message));
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p><input id="server" type="url" autoComplete="url" placeholder='Server URL' value={this.state.server} onChange={this.handleChange} /></p>
        <p><input id="username" type="text" autoComplete="username" placeholder='Username' value={this.state.username} onChange={this.handleChange} /></p>
        <p><input id="password" type="password" autoComplete="current-password" placeholder='Password' value={this.state.password} onChange={this.handleChange} /></p>
        <input type="submit" value="Log in" />
      </form>
    )
  }
}

class Chat extends Component {
  render() {
    return <Rooms client={this.props.client} />;
  }
}

class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      selectedRoom: undefined,
    };
  }

  handleChange = event => {
    this.setState({selectedRoom: event.target.value});
  }

  componentDidMount() {
    const rooms = this.props.client.getRooms()
    this.setState({rooms: rooms});
  }

  listRooms() {
    const rooms = this.state.rooms;
    return rooms.map(room =>
      <option key={room.roomId} value={room.roomId}>{room.name}</option>
    );
  }

  render() {
    const listOptions = this.listRooms()
    return (
      <select size="10" value={this.state.selectedRoom} onChange={this.handleChange}>
        {listOptions}
      </select>
    );
  }
}

export default App;

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
      <div className="container">
        <Header />
        {
          this.state.isClientReady ?
            <Chat client={this.state.client}/> :
            <Login setupClient={this.setupClient} />
        }
      </div>
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
      <div className="col-sm-5 mx-auto">
      <form onSubmit={this.handleSubmit}>

        <div className="form-group">
          <div className="input-group flex-nowrap">
            <div className="input-group-prepend">
              <span className="input-group-text"><i className="fas fa-at fa-fw"></i></span>
            </div>
            <input className="form-control" id="server" type="url" autoComplete="url" placeholder='Server URL' value={this.state.server} onChange={this.handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <div className="input-group flex-nowrap">
            <div className="input-group-prepend">
              <span className="input-group-text"><i className="fas fa-user fa-fw"></i></span>
            </div>
            <input className="form-control" id="username" type="text" autoComplete="username" placeholder='Username' value={this.state.username} onChange={this.handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <div className="input-group flex-nowrap">
            <div className="input-group-prepend">
              <span className="input-group-text"><i className="fas fa-key fa-fw"></i></span>
            </div>
            <input className="form-control" id="password" type="password" autoComplete="current-password" placeholder='Password' value={this.state.password} onChange={this.handleChange} required />
          </div>
        </div>

        <input className="btn btn-outline-primary btn-block" type="submit" value="Log in" />
      </form>
        </div>
    )
  }
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {},
      currentRoomId: null,
    };
  }

  setCurrentRoomId = roomId => {
    this.setState({currentRoomId: roomId});
  }

  sendMessage = text => {
    const roomId = this.state.currentRoomId;
    if (roomId === null) {
      return;
    }
    const content = {
      body: text,
      msgtype: "m.text"
    };
    this.props.client.sendEvent(roomId, "m.room.message", content, "")
      .then(response => {console.log("message sent successfully")})
      .catch(err => {console.log(err)});
  }

  componentDidMount() {
    this.props.client.on("Room.timeline", (event, room, toStartOfTimeline) => {
      if (event.getType() !== "m.room.message") {
          return;
      }
      const { messages } = this.state
      const roomMessages = room.roomId in messages ? messages[room.roomId] : []
      roomMessages.push({
        eventId: event.getId(),
        date: event.getDate().toLocaleString(),
        body: event.getContent().body,
        senderName: event.sender.name,
      })
      this.setState(prevState => ({
        messages: {
          ...prevState.messages,
          [room.roomId]: roomMessages,
        }
      }));
    });
  }

  render() {
    const { currentRoomId, messages } = this.state
    const currentMessages = currentRoomId in messages ? messages[currentRoomId] : []
    return (
      <div className="chat">
        <RoomSelect client={this.props.client} setCurrentRoomId={this.setCurrentRoomId} />
        <MessageList messages={currentMessages} />
        <SendMessageForm sendMessage={this.sendMessage} />
      </div>
    );
  }
}

class RoomSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      selectedRoomId: undefined,
    };
  }

  handleChange = event => {
    var roomId = event.target.value
    this.setState({selectedRoom: roomId});
    this.props.setCurrentRoomId(roomId)
  }

  componentDidMount() {
    const rooms = this.props.client.getRooms()
    this.setState({rooms: rooms});
  }

  listRooms() {
    const { rooms } = this.state;
    return rooms.map(room =>
      <option key={room.roomId} value={room.roomId}>{room.name}</option>
    );
  }

  render() {
    const listOptions = this.listRooms()
    return (
      <div className="input-group flex-nowrap mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Current room</span>
        </div>
        <select className="custom-select" value={this.state.selectedRoomId} onChange={this.handleChange}>
          {listOptions}
        </select>
      </div>
    );
  }
}

class MessageList extends Component {
  listMessages() {
    const { messages } = this.props;
    return messages.map(message =>
      <li className="message" key={message.eventId}>
        <div>{message.senderName} - {message.date}</div>
        <div>{message.body}</div>
      </li>
    );
  }

  render() {
    const listItems = this.listMessages()
    return (
      <ul className="message-list">
        {listItems}
      </ul>
    )
  }
}

class SendMessageForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }
  }

  handleChange = event => {
    this.setState({message: event.target.value})
  }

  handleSubmit = event => {
    this.props.sendMessage(this.state.message)
    this.setState({message: ''})
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-group flex-nowrap">
          <input className="form-control" type="text" placeholder="Type your message" value={this.state.message} onChange={this.handleChange} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="submit"><i className="fas fa-comment-dots"></i></button>
          </div>
        </div>
      </form>
    )
  }
}

function Header() {
  return (
    <header className="text-center mb-3">
      <h1>Tiny <a href="https://matrix.org/"><img src="https://matrix.org/images/matrix-logo.svg" alt="" /></a> client</h1>
    </header>
  )
}

export default App;

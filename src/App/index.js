import React, { Component } from "react";
import WSClient from '../WSClient';
import "./style.css";

const webSocketServerURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return '';
  } else {
    return 'ws://localhost:8080';
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      draftMessage: ''
    };
  }

  componentDidMount() {
    // Create WebSocket connection.
    this.socketClient = new WSClient(webSocketServerURL());
    // Listen for messages
    this.socketClient.on('chatMessage', chatMessage => this.onChatMessage(chatMessage));
  }

  onChatMessage(chatMessage) {
    this.setState((prevState, props) => {
      return {
        messages: prevState.messages.slice().concat(chatMessage)
      };
    });
  }

  onTextChange(evt) {
    this.setState({
      draftMessage: evt.target.value
    });
  }

  onFormSubmit(evt) {
    evt.preventDefault();
    const wsMessage = {
      username: 'eric',
      content: this.state.draftMessage
    };
    this.socketClient.send('chatMessage', wsMessage);
    this.setState({
      draftMessage: ''
    });
  }

  render() {
    const { draftMessage, messages } = this.state;
    return (
      <div className="App">
        <div className="messages">
        {messages.map(message => {
          return (<div key={message.content}>{message.username}: {message.content}</div>);
        })}
        </div>
        <form onSubmit={evt => this.onFormSubmit(evt)}>
          <input type="text" onChange={evt => this.onTextChange(evt)} value={draftMessage}/>
        </form>
      </div>
    );
  }
}

export default App;

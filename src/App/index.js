import React, { Component } from "react";
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
    this.socket = new WebSocket(webSocketServerURL());
    
    // Connection opened
    this.socket.addEventListener('open', function (evt) {
      console.log('WS connection opened');
      // socket.send('Hello Server!');
    });

    // Listen for messages
    this.socket.addEventListener('message', evt => this.handleWSMessage(evt));
  }

  handleWSMessage(evt) {
    const message = JSON.parse(evt.data);
    console.log('Message from server ', message);
    this.setState((prevState, props) => {
      return {
        messages: prevState.messages.slice().concat(message)
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
      type: 'chatMessage',
      username: 'eric',
      content: this.state.draftMessage
    };
    this.socket.send(JSON.stringify(wsMessage));
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

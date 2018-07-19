const WebSocket = require('ws');
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const caminte = require('caminte');
const Schema  = caminte.Schema;
const schemaConfig = {
  driver     : "postgres",
  host       : "localhost",
  port       : "5432",
  // username   : "test",
  // password   : "test",
  database   : "chat_app",
  pool       : true // optional for use pool directly 
};

const schema = new Schema(schemaConfig.driver, schemaConfig);

// define models
const ChatMessage = schema.define('messages', {
    content: { type: schema.String },
    username: { type: schema.String }
});

const PORT = process.env.PORT || 8080;

const chatMessages = [
  'hi'
];

app.get('/', (req, res, next) => {
  console.log('get route', req.testing);
  res.end();
});

const wss = expressWs.getWss();
// Broadcast a message to all clients.
wss.broadcast = message => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

app.ws('/', (ws, req) => {
  ChatMessage.all({}, (err, chatMessages) => {
    chatMessages.forEach(chatMessage => {
      const wsMessage = {
        event: 'chatMessage',
        data: {
          username: chatMessage.username,
          content: chatMessage.content
        }
      };
      ws.send(
        JSON.stringify(wsMessage)
      );
    });
  });
  ws.on('message', msgSerialized => {
    const msg = JSON.parse(msgSerialized);
    if (msg.event === 'chatMessage') {
      const chatMessage = ChatMessage.create({
        content: msg.data.content,
        username: msg.data.username
      }).then(created => {
        wss.broadcast(msgSerialized);
      });
    }
  });
});
 
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});
/*
The MIT License (MIT)

Copyright (c) 2014 Ismael Celis, Eric Andrew Lewis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-------------------------------*/
class WSClient {
  constructor(url) {
    this.socket = new WebSocket(url);

    this.callbacks = {};
  }

  on(eventName, callback) {
    this.callbacks[eventName] = this.callbacks[eventName] || [];
    this.callbacks[eventName].push(callback);

    this.socket.addEventListener('message', evt => this.onMessage(evt));
  }

  send(eventName, data) {
    const payload = JSON.stringify({
      event: eventName,
      data
    });
    this.socket.send(payload);
  }

  onMessage(evt) {
    const payload = JSON.parse(evt.data);
    this.dispatch(payload.event, payload.data);
  }

  dispatch(eventName, data) {
    const callbacks = this.callbacks[eventName];
    if (callbacks === undefined) {
      return;
    }
    callbacks.forEach(callback => {
      callback(data);
    })
  }
}

export default WSClient;
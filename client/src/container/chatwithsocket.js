import React, { Component } from 'react';
import io from 'socket.io-client';
import { SocketProvider } from 'socket.io-react';

import Chat from './chat/chat';
class ChatWithSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const url =
  process.env.NODE_ENV === 'production'
    ? '/'
    : 'http://localhost:8000/';
    const socket = io.connect(url);
    return (
      <SocketProvider socket={socket}>
        <Chat />
      </SocketProvider>
    );
  }
}

export default ChatWithSocket;

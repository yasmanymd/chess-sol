import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as io from 'socket.io-client';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

function guid(): string {
  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const socket = io('http://localhost:8080/');
const userId = guid();
socket.emit('auth', { userId: userId });
socket.on(userId, (message: {color: string, game: string}) => {
  console.log(message);
  socket.on(message.game, (move: any) => {
    console.log(move);
  });
});

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as io from 'socket.io-client';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const socket = io('https://chess-yas.herokuapp.com/');
socket.on('chat', (message: string) => alert(message));

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

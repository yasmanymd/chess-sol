import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as io from 'socket.io-client';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const socket = io();
socket.on('hello', (data: { message: string }) => alert(data.message));

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

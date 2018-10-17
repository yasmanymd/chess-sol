import * as React from 'react';
import * as io from 'socket.io-client';
import './App.css';

import logo from './logo.svg';
import BoardApp from './reducers/GameReducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import BoardContainer from './containers/BoardContainer';
import thunk from 'redux-thunk';

class App extends React.Component {
  public render() {
    const socket = io('https://chess-yas.herokuapp.com/');
    const store = createStore(
      BoardApp,
      applyMiddleware(thunk.withExtraArgument(socket))
    );

    function guid(): string {
      function s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    
    const userId = guid();
    socket.emit('auth', { userId: userId });
    socket.on(userId, (action: any) => {
      action.state = store.getState();
      store.dispatch(action);
    });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Provider store={store}>
            <BoardContainer />
          </Provider>
        </div>
      </div>
    );
  }
}

export default App;

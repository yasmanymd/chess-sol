import * as React from 'react';
import * as io from 'socket.io-client';
import './App.css';

import logo from './logo.svg';
import BoardApp from './reducers/GameReducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import BoardContainer from './containers/BoardContainer';
import thunk from 'redux-thunk';
import { Player } from './models/Player';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = { name: '', inputValue: '', time: null };
    this.onClick = this.onClick.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateTime = this.updateTime.bind(this);
  }

  updateInput(e: any) {
    this.setState({ inputValue: e.target.value });
  }

  updateTime(e: any) {
    this.setState({ time: e.target.value });
  }

  onClick() {
    this.setState({ name: this.state.inputValue });
  }

  public render() {
    if (this.state.name === ''){
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <div className="App-intro">
            <input type="text" onChange={this.updateInput} />
            <select onChange={this.updateTime}>
              <option selected value="300">5 min</option>
              <option value="420">7 min</option>
              <option value="600">10 min</option>
            </select>             
            <button onClick={this.onClick}>Submit</button>
          </div>
        </div>
      );
    }

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
    
    const player = new Player(guid(), this.state.name, this.state.time);
    socket.emit('auth', player);
    socket.on(player.Id, (action: any) => {
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

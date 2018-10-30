import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import BoardApp from './reducers/GameReducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import BoardContainer from './containers/BoardContainer';
import thunk from 'redux-thunk';
import { Player } from './models/Player';
import { Lobby } from './components/Lobby/Lobby';
import { GameRoom } from './components/GameRoom/GameRoom';

interface IAppState {
  player: Player | undefined;
  game: any | undefined;
}

class App extends React.Component<any, IAppState> {
  socket: any;
  store: any;
  
  constructor(props: any) {
    super(props);

    this.socket = window['io'].socket;
    this.store = createStore(
      BoardApp,
      applyMiddleware(thunk.withExtraArgument(this.socket))
    );

    this.state = { player: undefined, game: undefined };
    this.onSetName = this.onSetName.bind(this);
    this.onActionReceived = this.onActionReceived.bind(this);
  }

  private guid(): string {
    function s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  onSetName(name: string) {
    let player = new Player(this.guid(), name);
    this.setState({ player: player });

    this.socket.post('/setPlayer', player);
    this.socket.on('games', () => {

    });

    let store = this.store;
    this.socket.on(player.id, (action: any) => {
      action.state = store.getState();
      store.dispatch(action);
    });
  }

  onActionReceived(action: any) {
    action.state = this.store.getState();
    this.store.dispatch(action);
    this.setState({game: action.game});
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {this.state.player == undefined && (<Lobby onSetName={this.onSetName}></Lobby>)}
        {this.state.player != undefined && this.state.game == undefined && (<GameRoom socket={this.socket} player={this.state.player} onActionReceived={this.onActionReceived} ></GameRoom>)}
        {this.state.player != undefined && this.state.game != undefined && (
          <div className="App-intro">
            <Provider store={this.store}>
              <BoardContainer />
            </Provider>
          </div>
        )}        
      </div>
    );
  }
}

export default App;

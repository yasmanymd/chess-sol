import * as React from 'react';
import './App.css';

import BoardApp from './reducers/GameReducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import BoardContainer from './containers/BoardContainer';
import thunk from 'redux-thunk';
import { Lobby } from './components/Lobby/Lobby';
import { GameRoom } from './components/GameRoom/GameRoom';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

interface IAppState {
  player: string | undefined;
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
    this.onGameOver = this.onGameOver.bind(this);
  }

  onSetName(name: string) {
    let player = name;
    this.setState({ player: player });
  }

  onActionReceived(action: any) {
    action.state = this.store.getState();
    this.store.dispatch(action);
    if (!this.state.game) {
      this.setState({game: action.game});
    }
  }

  onGameOver() {
    this.setState({game: undefined});
    this.store = createStore(
      BoardApp,
      applyMiddleware(thunk.withExtraArgument(this.socket))
    );

  }

  public render() {
    return (
      <div className="App">
        <AppBar position="fixed" style={{zIndex: 1201}}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Welcome to React, Material Design and Bitboards
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="main">
          {this.state.player == undefined && (<Lobby onSetName={this.onSetName}></Lobby>)}
          {this.state.player != undefined && this.state.game == undefined && (<GameRoom socket={this.socket} player={this.state.player} onActionReceived={this.onActionReceived} ></GameRoom>)}
          {this.state.player != undefined && this.state.game != undefined && (
            <div className="App-intro">
              <Provider store={this.store}>
                <BoardContainer onGameOver={this.onGameOver} />
              </Provider>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;

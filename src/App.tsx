import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import BoardApp from './reducers/GameReducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import BoardContainer from './containers/BoardContainer';

class App extends React.Component {
  public render() {
    const store = createStore(BoardApp);
    window["store"] = store;

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

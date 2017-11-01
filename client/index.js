import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import React, { Component } from 'react';
import App from './App';
import store from './store';


class RClient extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('RClient', () => RClient);

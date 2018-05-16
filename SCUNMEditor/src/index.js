import React from 'react';
import ReactDOM from 'react-dom';
import store from "./store/reduxStore";
const title = 'Here comes the editor';
import { Provider } from "react-redux";
import App from "./components/App";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
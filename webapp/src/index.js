import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import gUtil from './utils'

document.documentElement.style.fontSize = document.documentElement.clientWidth * 100 / 750 + 'px'

window.gUtil = gUtil
ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

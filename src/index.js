import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'
import {Provider} from 'react-redux'
import{BrowserRouter} from 'react-router-dom'
import 'antd/dist/antd.css'

import App from './containers/app/app'

 
    ReactDOM.render(
    <BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>
    </BrowserRouter>
    ,document.getElementById('root')
    );

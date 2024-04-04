
import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { middleware as thunkMiddleware } from 'redux-saga-thunk'
import IndexReducer from './reducers'
import IndexSagas from './sagas'
import { SingletonHooksContainer } from 'react-singleton-hook'
import TopbarContainer from './containers/Topbar/TopbarContainer'
import Sidebar from './components/Nav/Sidebar/index.jsx'
import ModalRoot from './containers/Modals'
import renderer from './renderer'

import SocketGlobal from 'containers/Global/SocketGlobal'
import SessionLoader from 'lib2/sessionLoader'
import HotKeysGlobal from 'containers/Global/HotKeysGlobal'
import BackupRestoreOverlay from 'containers/Global/BackupRestoreOverlay'
import ChatDock from 'containers/Global/ChatDock'

const sagaMiddleware = createSagaMiddleware()

/*const composeSetup = window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f 
/*eslint-disable */
const composeSetup =
  process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose 
/*eslint-enable */

// if (process.env.NODE_ENV !== 'production') {
localStorage.setItem('debug', 'trudesk:*') // Enable logger
// }

const store = createStore(IndexReducer, composeSetup(applyMiddleware(thunkMiddleware, sagaMiddleware)))

window.react.redux = { store }

sagaMiddleware.run(IndexSagas)

if (document.getElementById('globals')) {
  const GlobalsRoot = (
    <Provider store={store}>
      <>
        <SingletonHooksContainer />
        <SessionLoader />
        <SocketGlobal />
        {/*<HotKeysGlobal />*/}

        <ChatDock />
        <BackupRestoreOverlay />
      </>
    </Provider>
  )

  ReactDOM.render(GlobalsRoot, document.getElementById('globals'))
}

const sidebarWithProvider = (
  <Provider store={store}>
    <Sidebar />
  </Provider>
)

ReactDOM.render(sidebarWithProvider, document.getElementById('sidebar'))

if (document.getElementById('modal-wrapper')) {
  const RootModal = (
    <Provider store={store}>
      <ModalRoot />
    </Provider>
  )
  ReactDOM.render(RootModal, document.getElementById('modal-wrapper'))
}

if (document.getElementById('topbar')) {
  const TopbarRoot = (
    <Provider store={store}>
      <TopbarContainer />
    </Provider>
  )

  ReactDOM.render(TopbarRoot, document.getElementById('topbar'))
}

window.react.renderer = renderer
window.react.dom = ReactDOM

renderer(store)

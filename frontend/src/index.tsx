import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'

import App from './App'
import './App.css'
import configureStore from './redux/configureStore'
import * as serviceWorker from './serviceWorker'

const store = configureStore()
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  spacing: {
    unit: 16,
  },
  shape: {
    borderRadius: 8,
  },
  overrides: {
    MuiDialogTitle: {
      root: {
        textAlign: 'center',
      },
    },
  },
})

ReactDOM.render(
  <Provider store={store}>
    <CssBaseline>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </CssBaseline>
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

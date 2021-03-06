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

// https://material-ui.com/guides/typescript/
declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    colors: {
      background: {
        default: '#444444';
        editorTabColor: '#2b2b2b';
        editor: '#1e1e1e';
        lightGray: '#585858';
      };
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    colors?: {
      background: {
        default: '#444444';
        editorTabColor: '#2b2b2b';
        editor: '#1e1e1e';
        lightGray: '#585858';
      };
    }
  }
}

const WHITE_COLOR = '#9da5ab'
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
    MuiTypography: {
      h3: {
        textAlign: 'center',
        color: WHITE_COLOR,
      },
      h6: {
        textAlign: 'center',
        color: WHITE_COLOR,
      },
      body2: {
        textAlign: 'center',
        color: WHITE_COLOR,
      },
    },
  },
  palette: {
    type: 'dark',
    common: {
      white: WHITE_COLOR,
    },
  },
  colors: {
    background: {
      default: '#444444',
      editor: '#1e1e1e',
      editorTabColor: '#2b2b2b',
      lightGray: '#585858',
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

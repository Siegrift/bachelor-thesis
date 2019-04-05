import React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import { compose } from 'redux'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CaptureKeysHOC } from './components/CaptureKeysHOC'
import LoginScreen from './components/LoginScreen'
import { connect } from 'react-redux'
import { State } from './redux/types'
import { User } from './types/common'
import MainScreen from './components/MainScreen'
import { PROCEED_WITHOUT_SIGNIN } from './constants'

const styles = (theme: Theme) =>
  createStyles({
    app: {
      backgroundColor: theme.colors.background.default,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

interface Props extends WithStyles<typeof styles> {
  user?: User
}

class App extends React.Component<Props> {
  render() {
    const { classes, user } = this.props
    return (
      <div className={classes.app}>
        {user || PROCEED_WITHOUT_SIGNIN ? <MainScreen /> : <LoginScreen />}
      </div>
    )
  }
}

export default compose(
  // FIXME: this HOC has bugs! If tit's not first the app won't load
  CaptureKeysHOC,
  withStyles(styles),
  connect((state: State) => ({
    user: state.user,
  })),
)(App) as any // FIXME: short-term hack

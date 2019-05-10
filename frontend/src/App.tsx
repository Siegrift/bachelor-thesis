import React from 'react'
import {
  createStyles,
  withStyles,
  WithStyles,
  withTheme
} from '@material-ui/core'
import { compose } from 'redux'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CaptureKeysHOC } from './components/CaptureKeysHOC'
import LoginScreen from './components/LoginScreen'
import { connect } from 'react-redux'
import { State } from './redux/types'
import { User } from './types/common'
import MainScreen from './components/MainScreen'
import { PROCEED_WITHOUT_SIGNIN } from './constants'
import Dialog from './components/dialogs/DialogContainer'
import AdminDashboard from './components/dashboards/AdminDashboard'

const styles = (theme: Theme) =>
  createStyles({
    app: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

interface Props extends WithStyles<typeof styles> {
  user?: User
  theme: Theme
}

class App extends React.Component<Props> {
  render() {
    const { classes, user, theme } = this.props
    return (
      <div
        className={classes.app}
        style={{
          backgroundColor:
            // TODO: instead of !user, there should be user
            !user || user.isAdmin ? '#fafafa' : theme.colors.background.default,
        }}
      >
        {user || PROCEED_WITHOUT_SIGNIN ? <AdminDashboard /> : <LoginScreen />}
        <Dialog />
      </div>
    )
  }
}

export default compose(
  // FIXME: this HOC has bugs! If tit's not first the app won't load
  CaptureKeysHOC,
  withTheme(),
  withStyles(styles),
  connect((state: State) => ({
    user: state.user,
  })),
)(App) as any // FIXME: short-term hack

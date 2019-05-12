import {
  createStyles,
  withStyles,
  WithStyles,
  withTheme
} from '@material-ui/core'
import { State } from './redux/types'
import { compose } from 'redux'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CaptureKeysHOC } from './components/CaptureKeysHOC'
import LoginScreen from './components/LoginScreen'
import { connect } from 'react-redux'
import React from 'react'
import { User } from './types/common'
import Dialog from './components/dialogs/DialogContainer'
import AdminDashboard from './components/dashboards/AdminDashboard'
import classNames from 'classnames'
import OrdinaryDashboard from './components/dashboards/OrdinaryDashboard'

const styles = () =>
  createStyles({
    fixedAppWindow: {
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
  shouldRenderAdminDashboard = () => {
    const { user } = this.props

    if (user && user.isAdmin) return true
    else return false
  }

  shouldRenderOrdinaryDashboard = () => {
    const { user } = this.props

    if (user && !user.isAdmin) return true
    else return false
  }

  renderChild = () => {
    if (this.shouldRenderAdminDashboard()) return <AdminDashboard />
    else if (this.shouldRenderOrdinaryDashboard()) return <OrdinaryDashboard />
    else return <LoginScreen />
  }

  render() {
    const { classes, user, theme } = this.props
    return (
      <div
        className={classNames(
          !this.shouldRenderAdminDashboard() && classes.fixedAppWindow,
        )}
        style={{
          backgroundColor: this.shouldRenderAdminDashboard()
            ? '#fafafa'
            : theme.colors.background.default,
        }}
      >
        {this.renderChild()}
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

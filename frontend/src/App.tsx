import React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import { compose } from 'redux'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { CaptureKeysHOC } from './components/CaptureKeysHOC'
import LoginScreen from './components/LoginScreen'

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

interface Props extends WithStyles<typeof styles> {}
class App extends React.Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.app}>
        <LoginScreen />
      </div>
    )
  }
}

export default compose(
  // FIXME: this HOC has bugs! If tit's not first the app won't load
  CaptureKeysHOC,
  withStyles(styles),
)(App) as any // FIXME: short-term hack

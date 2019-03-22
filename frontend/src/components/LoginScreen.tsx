import React, { Component } from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { State } from '../redux/types'

const styles = (theme: Theme) =>
  createStyles({
    loginPanel: {
      width: '400px',
      height: '400px',
      backgroundColor: theme.colors.background.editor,
      borderRadius: 10,
      border: `solid 3px ${theme.palette.common.black}`,
    },
  })

interface Props extends WithStyles<typeof styles> {
  screenType: 'login' | 'register'
}

class LoginScreen extends Component<Props> {
  render() {
    const { classes, screenType } = this.props
    return (
      <div className={classes.loginPanel}>
        {screenType === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  connect((state: State) => ({
    screenType: state.login.type,
  })),
  // FIXME: 'LoginScreen' does not have any construct or call signatures.
)(LoginScreen) as any

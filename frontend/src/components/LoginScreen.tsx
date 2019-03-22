import React, { Component } from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Typography from '@material-ui/core/Typography'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { State } from '../redux/types'

const styles = (theme: Theme) =>
  createStyles({
    loginPanel: {
      width: '400px',
      height: '450px',
      backgroundColor: theme.colors.background.editor,
      borderRadius: 10,
      border: `solid 3px ${theme.palette.common.black}`,
    },
    errorMessage: {
      color: theme.palette.error.dark,
    },
  })

interface Props extends WithStyles<typeof styles> {
  screenType: 'login' | 'register'
  errorMessage?: string
}

class LoginScreen extends Component<Props> {
  render() {
    const { classes, screenType, errorMessage } = this.props
    return (
      <div className={classes.loginPanel}>
        {screenType === 'login' ? <LoginForm /> : <RegisterForm />}

        {errorMessage && (
          <Typography variant="body2" className={classes.errorMessage}>
            {errorMessage}
          </Typography>
        )}
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  connect((state: State) => ({
    screenType: state.login.type,
    errorMessage: state.login.errorMessage,
  })),
  // FIXME: 'LoginScreen' does not have any construct or call signatures.
)(LoginScreen) as any

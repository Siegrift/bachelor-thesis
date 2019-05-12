import React, { Component } from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Typography from '@material-ui/core/Typography'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { State } from '../redux/types'
import DarkPaper from './lib/DarkPaper'

const styles = (theme: Theme) =>
  createStyles({
    loginPanel: {
      width: '400px',
    },
    errorMessage: {
      color: theme.palette.error.dark,
      marginBottom: theme.spacing.unit * 2,
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
      <DarkPaper className={classes.loginPanel} elevation={10}>
        {screenType === 'login' ? <LoginForm /> : <RegisterForm />}

        {errorMessage && (
          <Typography variant="body2" className={classes.errorMessage}>
            {errorMessage}
          </Typography>
        )}
      </DarkPaper>
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

import Link from '@material-ui/core/Link'
import { compose } from 'redux'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux'
import { State } from '../redux/types'
import { LoginState } from '../types/common'
import { updateValue as _updateValue } from '../actions/sharedActions'
import {
  loginUser as _loginUser,
  toggleFormType as _toggleFormType
} from '../actions/userActions'

const styles = (theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: theme.spacing.unit / 2,
      },
    },
    registerLink: {
      cursor: 'pointer',
    },
  })

interface Props extends WithStyles<typeof styles> {
  login: LoginState
  toggleFormType: typeof _toggleFormType
  updateValue: typeof _updateValue
  loginUser: typeof _loginUser
}

class LoginForm extends Component<Props> {
  changeFieldText = (stateName: 'name' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.props.updateValue(['login', stateName], e.target.value)
  }

  loginOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.props.loginUser()
    }
  }

  render() {
    const { classes, login, loginUser, toggleFormType } = this.props
    return (
      <React.Fragment>
        <Typography variant="h3" gutterBottom={true}>
          Prihlásenie
        </Typography>

        <div className={classes.form}>
          <TextField
            label="Meno"
            value={login.name}
            placeholder="Zadaj meno"
            margin="normal"
            autoComplete="new-password"
            onChange={this.changeFieldText('name')}
            onKeyPress={this.loginOnEnter}
          />

          <TextField
            label="Heslo"
            value={login.password}
            type="password"
            margin="normal"
            autoComplete="new-password"
            onChange={this.changeFieldText('password')}
            onKeyPress={this.loginOnEnter}
          />

          <Button variant="contained" color="primary" onClick={loginUser}>
            Prihlásiť
          </Button>

          <Typography variant="body2">
            ak nemáte účet tak sa{' '}
            <Link onClick={toggleFormType} className={classes.registerLink}>
              zaregistrujte
            </Link>
          </Typography>
        </div>
      </React.Fragment>
    )
  }
}

export default compose(
  withStyles(styles),
  connect(
    (state: State) => ({ login: state.login }),
    {
      toggleFormType: _toggleFormType,
      updateValue: _updateValue,
      loginUser: _loginUser,
    },
  ),
  // FIXME: 'LoginForm' does not have any construct or call signatures.
)(LoginForm) as any

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
  createUser as _registerUser,
  toggleFormType as _toggleFormType
} from '../actions/loginActions'

const styles = (theme: Theme) =>
  createStyles({
    form: {
      margin: theme.spacing.unit * 2,
    },
    formContent: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: theme.spacing.unit / 2,
      },
    },
    loginLink: {
      cursor: 'pointer',
    },
  })

interface Props extends WithStyles<typeof styles> {
  login: LoginState
  toggleFormType: typeof _toggleFormType
  updateValue: typeof _updateValue
  createUser: typeof _registerUser
}

class RegisterForm extends Component<Props> {
  changeFieldText = (stateName: 'name' | 'password' | 'repeatPassword') => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.props.updateValue(['login', stateName], e.target.value)
  }

  render() {
    const { classes, login, createUser, toggleFormType } = this.props
    return (
      <div className={classes.form}>
        <Typography variant="h3" gutterBottom={true}>
          Registrácia
        </Typography>

        <div className={classes.formContent}>
          <TextField
            label="Meno"
            value={login.name}
            placeholder="Zadaj meno"
            margin="normal"
            autoComplete="new-password"
            onChange={this.changeFieldText('name')}
          />

          <TextField
            label="Heslo"
            value={login.password}
            type="password"
            margin="normal"
            autoComplete="new-password"
            onChange={this.changeFieldText('password')}
          />

          <TextField
            label="Zopakujte heslo"
            value={login.repeatPassword}
            type="password"
            margin="normal"
            autoComplete="new-password"
            onChange={this.changeFieldText('repeatPassword')}
          />

          {/* TODO: check if passwords match */}
          <Button variant="contained" color="primary" onClick={createUser}>
            Registrovať
          </Button>

          <Typography variant="body2">
            ak už účet máte tak sa{' '}
            <Link onClick={toggleFormType} className={classes.loginLink}>
              prihláste
            </Link>
          </Typography>
        </div>
      </div>
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
      createUser: _registerUser,
    },
  ),
  // FIXME: 'RegisterForm' does not have any construct or call signatures.
)(RegisterForm) as any

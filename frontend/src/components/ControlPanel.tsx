import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Grid from '@material-ui/core/Grid'
import RunIcon from '@material-ui/icons/Send'
import SaveIcon from '@material-ui/icons/CloudUpload'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { Component } from 'react'
import { withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { compose } from 'redux'
import { saveFiles as _saveFiles } from '../actions/editorActions'
import { State } from '../redux/types'
import { connect } from 'react-redux'

const styles = (theme: Theme) => ({
  controlPanel: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background.editorTabColor,
    display: 'flex',
    // FIXME: ts has some problems with flexDirection property
    flexDirection: 'column' as any,
    padding: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
})

interface Props extends WithStyles<typeof styles> {
  saveFiles: typeof _saveFiles
}

class ControlPanel extends Component<Props, {}> {
  handleSave = () => {
    this.props.saveFiles('Save - ' + new Date().getTime())
  }

  render() {
    const { classes, saveFiles } = this.props

    return (
      <Grid container={true} className={classes.controlPanel}>
        <Button variant="contained" color="primary" className={classes.button}>
          Nastavenia
          <SettingsIcon className={classes.rightIcon} />
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleSave}
        >
          ULožiť
          <SaveIcon className={classes.rightIcon} />
        </Button>

        <Button variant="contained" color="primary" className={classes.button}>
          Spustiť
          <RunIcon className={classes.rightIcon} />
        </Button>
      </Grid>
    )
  }
}

export default compose(
  withStyles(styles),
  connect(
    (state: State) => ({
      editors: state.editors,
    }),
    {
      saveFiles: _saveFiles,
    },
  ),
)(ControlPanel) as any

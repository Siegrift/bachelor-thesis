import { withStyles, WithStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import RunIcon from '@material-ui/icons/Send'
import SaveIcon from '@material-ui/icons/CloudUpload'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { compose } from 'redux'
import {
  runCode as _runCode,
  saveFiles as _saveFiles
} from '../actions/editorActions'
import { State } from '../redux/types'
import { connect } from 'react-redux'
import { formatRunCodeAutosaveFolderName } from '../utils'

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
  runCode: typeof _runCode
}

class ControlPanel extends Component<Props, {}> {
  handleSave = () => {
    // import { format } from 'date-fns'
    // import skLocale from 'date-fns/locale/sk'
    // format(new Date(), 'MM-DD-YYYY HH:mm:ss', {
    //   locale: skLocale,
    // })
    this.props.saveFiles(formatRunCodeAutosaveFolderName())
  }

  render() {
    const { classes, runCode } = this.props

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
          Uložiť
          <SaveIcon className={classes.rightIcon} />
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={runCode}
        >
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
      runCode: _runCode,
    },
  ),
)(ControlPanel) as any

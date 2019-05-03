import { withStyles, WithStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import RunIcon from '@material-ui/icons/Send'
import SaveIcon from '@material-ui/icons/CloudUpload'
import LoadIcon from '@material-ui/icons/Archive'
import SubmitIcon from '@material-ui/icons/Done'
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { compose } from 'redux'
import {
  runCode as _runCode,
  setDialogValue as _setDialogValue
} from '../actions/editorActions'
import { State } from '../redux/types'
import { connect } from 'react-redux'
import { DialogType } from '../types/common'

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
  setDialogValue: typeof _setDialogValue
}

class ControlPanel extends Component<Props, {}> {
  showDialog = (dialog: DialogType) => () => {
    this.props.setDialogValue(dialog)
  }

  render() {
    const { classes } = this.props

    return (
      <Grid container={true} className={classes.controlPanel}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.showDialog('save')}
        >
          Uložiť
          <SaveIcon className={classes.rightIcon} />
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.showDialog('load')}
        >
          Načítať
          <LoadIcon className={classes.rightIcon} />
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.showDialog('run')}
        >
          Spustiť
          <RunIcon className={classes.rightIcon} />
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.showDialog('submit')}
        >
          Odovzdať
          <SubmitIcon className={classes.rightIcon} />
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
    { setDialogValue: _setDialogValue },
  ),
)(ControlPanel) as any

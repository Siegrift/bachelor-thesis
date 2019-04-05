import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Grid from '@material-ui/core/Grid'
import RunIcon from '@material-ui/icons/Send'
import SaveIcon from '@material-ui/icons/CloudUpload'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { Component } from 'react'
import { withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { compose } from 'redux'

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

interface Props extends WithStyles<typeof styles> {}

class ControlPanel extends Component<Props, {}> {
  render() {
    const { classes } = this.props

    return (
      <Grid container={true} className={classes.controlPanel}>
        <Button variant="contained" color="primary" className={classes.button}>
          Nastavenia
          <SettingsIcon className={classes.rightIcon} />
        </Button>

        <Button variant="contained" color="primary" className={classes.button}>
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

export default compose(withStyles(styles))(ControlPanel) as any

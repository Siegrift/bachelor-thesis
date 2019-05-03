import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import CircularProgress from '@material-ui/core/CircularProgress'
import { SandboxResponse } from '../../types/common'

const NOT_YET_STARTED = 'NOT_YET_STARTED'
const STARTED = 'STARTED'
const FINISHED = 'FINISHED'

const styles = (theme: Theme) => ({
  button: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  spinner: {
    color: theme.palette.common.white,
    marginLeft: theme.spacing.unit / 2,
  },
})

interface Props extends WithStyles<typeof styles> {
  closeDialog: () => void
  runCode: (customInput: string) => Promise<SandboxResponse>
}

class RunDialog extends React.Component<Props> {
  state = {
    selectedEntry: undefined,
    testing: NOT_YET_STARTED,
    output: {
      data: '',
    },
    input: '',
  }

  onRunCode = async () => {
    const { runCode } = this.props
    const { testing } = this.state

    if (testing === STARTED) return

    this.setState({ testing: STARTED })
    const output = await runCode(this.state.input)
    this.setState({ testing: FINISHED, output })
  }

  onListItemClick = (clickedItem: string) => () => {
    this.setState({ selectedEntry: clickedItem })
  }

  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value })
  }

  renderRunButtonText = () => {
    const { testing } = this.state
    const { classes } = this.props

    if (testing === NOT_YET_STARTED) return 'Spustiť'
    else if (testing === FINISHED) return 'Spustiť znovu'
    else {
      return [
        <span key="text">Spúšťam </span>,
        <CircularProgress
          key="progress"
          size={20}
          className={classes.spinner}
        />,
      ]
    }
  }

  render() {
    const { closeDialog, classes } = this.props
    const { input, output } = this.state

    return [
      <DialogTitle key="title" id="form-dialog-title">
        Spustiť
      </DialogTitle>,
      <DialogContent key="content">
        <DialogContentText>
          Spustite váš kód na vlastnom vstupe
        </DialogContentText>
        <TextField
          className={classes.button}
          variant="filled"
          autoFocus={true}
          id="name"
          label="Vstup"
          type="text"
          fullWidth={true}
          multiline={true}
          rowsMax={8}
          value={input}
          onChange={this.onChangeInput}
        />

        <TextField
          className={classes.button}
          variant="filled"
          autoFocus={true}
          id="name"
          label="Výstup"
          type="text"
          fullWidth={true}
          multiline={true}
          disabled={true}
          rowsMax={8}
          value={output.data}
        />
      </DialogContent>,
      <DialogActions key="actions">
        <Button onClick={closeDialog} color="primary" variant="contained">
          Zrušiť
        </Button>
        <Button onClick={this.onRunCode} color="primary" variant="contained">
          {this.renderRunButtonText()}
        </Button>
      </DialogActions>,
    ]
  }
}

export default withStyles(styles)(RunDialog)

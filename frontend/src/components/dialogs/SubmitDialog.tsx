import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import CircularProgress from '@material-ui/core/CircularProgress'
import { SubmitResponse } from '../../types/common'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

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
  submitCode: () => Promise<SubmitResponse>
}

interface LocalState {
  submitResponse?: SubmitResponse
}

class SubmitDialog extends React.Component<Props> {
  state: LocalState = {
    submitResponse: undefined,
  }

  onListItemClick = (clickedItem: string) => () => {
    this.setState({ selectedEntry: clickedItem })
  }

  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value })
  }

  renderRunButtonText = () => {
    const { submitResponse } = this.state
    const { classes } = this.props

    if (submitResponse) return 'Ukončiť testovanie'
    else {
      return [
        <span key="text">Testujem </span>,
        <CircularProgress
          key="progress"
          size={20}
          className={classes.spinner}
        />,
      ]
    }
  }

  onFinishTestingCode = () => {
    const { submitResponse } = this.state
    const { closeDialog } = this.props

    if (submitResponse) closeDialog()
  }

  async componentDidMount() {
    const submitResponse = await this.props.submitCode()

    this.setState({ submitResponse })
  }

  prepareRowData = (): string[] => {
    const { submitResponse } = this.state

    if (!submitResponse) return []
    else {
      const { input, result } = submitResponse
      const data = Array(submitResponse.input + 1).fill('OK')
      data[input] = result
      return data
    }
  }

  render() {
    const { closeDialog, classes } = this.props

    return [
      <DialogTitle key="title" id="form-dialog-title">
        Testovač
      </DialogTitle>,
      <DialogContent key="content">
        <DialogContentText>Kód bol odoslaný na testovač</DialogContentText>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vstup</TableCell>
              <TableCell align="right">Výsledok</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.prepareRowData().map((row, input) => (
              <TableRow key={input}>
                <TableCell component="th" scope="row">
                  {`${input + 1}.in`}
                </TableCell>
                <TableCell align="right">{row}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>,
      <DialogActions key="actions">
        <Button onClick={closeDialog} color="primary" variant="contained">
          Zrušiť
        </Button>
        <Button
          onClick={this.onFinishTestingCode}
          color="primary"
          variant="contained"
        >
          {this.renderRunButtonText()}
        </Button>
      </DialogActions>,
    ]
  }
}

export default withStyles(styles)(SubmitDialog)

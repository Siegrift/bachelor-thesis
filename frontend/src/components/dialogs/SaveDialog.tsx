import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'

const SAVE_AS_REGEX = /^[A-Za-z0-9/-]+$/

interface Props {
  closeDialog: () => void
  createUpload: (saveAs: string, isAutosave: boolean) => void
}

class SaveDialog extends React.Component<Props> {
  state = { saveAs: '', error: false }

  onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    this.setState({ saveAs: value, error: !SAVE_AS_REGEX.test(value) })
  }

  onSaveFiles = () => {
    const { closeDialog } = this.props
    const { saveAs } = this.state

    if (!SAVE_AS_REGEX.test(saveAs)) {
      this.setState({ error: true })
    } else {
      this.props.createUpload(this.state.saveAs, false)
      closeDialog()
    }
  }

  saveOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.onSaveFiles()
    }
  }

  render() {
    const { closeDialog } = this.props
    const { saveAs, error } = this.state

    return [
      <DialogTitle key="title" id="form-dialog-title">
        Uložiť
      </DialogTitle>,
      <DialogContent key="content">
        <TextField
          autoFocus={true}
          id="name"
          label="Názov pre uložené súbory"
          type="text"
          fullWidth={true}
          required={true}
          error={error}
          value={saveAs}
          onChange={this.onChangeText}
          onKeyDown={this.saveOnEnter}
        />
      </DialogContent>,
      <DialogActions key="actions">
        <Button onClick={closeDialog} color="primary" variant="contained">
          Zrušiť
        </Button>
        <Button
          onClick={this.onSaveFiles}
          color="primary"
          variant="contained"
          disabled={!SAVE_AS_REGEX.test(saveAs)}
        >
          Uložiť
        </Button>
      </DialogActions>,
    ]
  }
}

export default SaveDialog

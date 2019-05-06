import {
  listUploads as _listUploads,
  loadFiles as _loadFiles,
  runCode as _runCode,
  saveFiles as _saveFiles,
  setDialogValue as _setDialogValue,
  submitCode as _submitCode
} from '../../actions/editorActions'
import MuiDialog from '@material-ui/core/Dialog'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { State } from '../../redux/types'
import React from 'react'
import {
  DialogType,
  SandboxResponse,
  SubmitResponse,
  UploadState
} from '../../types/common'
import SaveDialog from './SaveDialog'
import LoadDialog from './LoadDialog'
import RunDialog from './RunDialog'
import SubmitDialog from './SubmitDialog'

interface Props {
  dialog: DialogType
  uploads: UploadState
  setDialogValue: typeof _setDialogValue
  runCode: (customInput: string) => Promise<SandboxResponse>
  saveFiles: typeof _saveFiles
  listUploads: typeof _listUploads
  loadFiles: typeof _loadFiles
  submitCode: () => Promise<SubmitResponse>
}

class DialogContainer extends React.Component<Props> {
  handleClose = () => {
    this.props.setDialogValue(undefined)
  }

  renderDialogContent = () => {
    const {
      dialog,
      saveFiles,
      uploads,
      listUploads,
      loadFiles,
      runCode,
      submitCode,
    } = this.props

    if (dialog === 'save') {
      return (
        <SaveDialog closeDialog={this.handleClose} saveFiles={saveFiles} />
      )
    } else if (dialog === 'load') {
      return (
        <LoadDialog
          closeDialog={this.handleClose}
          loadFiles={loadFiles}
          uploads={uploads}
          refetchUploads={listUploads}
        />
      )
    } else if (dialog === 'run') {
      return <RunDialog closeDialog={this.handleClose} runCode={runCode} />
    } else if (dialog === 'submit') {
      return (
        <SubmitDialog closeDialog={this.handleClose} submitCode={submitCode} />
      )
    } else {
      throw new Error(`Unknown dialog type ${dialog}`)
    }
  }

  render() {
    const { dialog } = this.props

    return (
      <div>
        {dialog && (
          <MuiDialog
            open={!!dialog}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
          >
            {this.renderDialogContent()}
          </MuiDialog>
        )}
      </div>
    )
  }
}

export default compose(
  connect(
    (state: State) => ({
      dialog: state.dialog,
      uploads: state.uploads,
    }),
    {
      saveFiles: _saveFiles,
      runCode: _runCode,
      setDialogValue: _setDialogValue,
      listUploads: _listUploads,
      loadFiles: _loadFiles,
      submitCode: _submitCode,
    },
  ),
)(DialogContainer as any)

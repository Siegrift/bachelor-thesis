import MuiDialog from '@material-ui/core/Dialog'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { State } from '../../redux/types'
import {
  createUpload as _createUpload,
  getUpload as _getUpload,
  getUploads as _getUploads,
  runCode as _runCode,
  setDialogValue as _setDialogValue,
  submitCode as _submitCode
} from '../../actions/editorActions'
import {
  DialogType,
  SandboxResponse,
  SubmitResponse,
  UploadsState
} from '../../types/common'
import SaveDialog from './SaveDialog'
import LoadDialog from './LoadDialog'
import RunDialog from './RunDialog'
import SubmitDialog from './SubmitDialog'

interface Props {
  dialog: DialogType
  uploadsState: UploadsState
  setDialogValue: typeof _setDialogValue
  runCode: (customInput: string) => Promise<SandboxResponse>
  createUpload: typeof _createUpload
  getUploads: typeof _getUploads
  getUpload: typeof _getUpload
  submitCode: () => Promise<SubmitResponse>
}

class DialogContainer extends React.Component<Props> {
  handleClose = () => {
    this.props.setDialogValue(undefined)
  }

  renderDialogContent = () => {
    const {
      dialog,
      createUpload,
      uploadsState,
      getUploads,
      getUpload,
      runCode,
      submitCode,
    } = this.props

    if (dialog === 'save') {
      return (
        <SaveDialog
          closeDialog={this.handleClose}
          createUpload={createUpload}
        />
      )
    } else if (dialog === 'load') {
      return (
        <LoadDialog
          closeDialog={this.handleClose}
          getUpload={getUpload}
          uploadsState={uploadsState}
          refetchUploads={getUploads}
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
      uploadsState: state.uploadsState,
    }),
    {
      createUpload: _createUpload,
      runCode: _runCode,
      setDialogValue: _setDialogValue,
      getUploads: _getUploads,
      getUpload: _getUpload,
      submitCode: _submitCode,
    },
  ),
)(DialogContainer as any)

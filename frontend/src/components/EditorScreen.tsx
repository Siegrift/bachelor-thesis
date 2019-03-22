import React, { Component } from 'react'
import MonacoEditor, {
  ChangeHandler,
  EditorDidMount
} from 'react-monaco-editor'
import { withStyles } from '@material-ui/core'
import { editor as Editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { getSynchronizer, Synchronizer } from '../codeSynchronizer'

const styles = {}

class EditorScreen extends Component<{}, { code: string }> {
  state = {
    code: '// type your code...',
  }
  editorRef?: Editor.IStandaloneCodeEditor
  synchronizer?: Synchronizer

  editorDidMount: EditorDidMount = async (editor, monaco) => {
    this.editorRef = editor

    this.synchronizer = await getSynchronizer()
    this.synchronizer!.share.textarea.bindMonaco(this.editorRef!)

    editor.focus()
  }

  onChange: ChangeHandler = (newValue, e) => {
    this.setState({ code: newValue })
  }

  render() {
    const code = this.state.code
    const options = {
      selectOnLineNumbers: true,
    }
    return (
      <MonacoEditor
        width="800"
        height="600"
        // languages needs to be added in webpack too
        language="cpp"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    )
  }
}

export default withStyles(styles)(EditorScreen)

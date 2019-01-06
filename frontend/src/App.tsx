import React, { Component } from 'react'
import MonacoEditor, {
  ChangeHandler,
  EditorDidMount
} from 'react-monaco-editor'
import { withStyles } from '@material-ui/core'
import { editor as Editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { compose } from 'recompose'
import { CaptureKeysHOC } from './CaptureKeysHOC'

const styles = {}

class App extends Component<{}, { code: string }> {
  state = {
    code: '// type your code...',
  }
  editorRef?: Editor.IStandaloneCodeEditor

  editorDidMount: EditorDidMount = (editor, monaco) => {
    this.editorRef = editor
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
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    )
  }
}

export default compose(
  withStyles(styles),
  CaptureKeysHOC,
)(App)

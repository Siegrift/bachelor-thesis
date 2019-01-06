import React, { Component } from 'react'
import MonacoEditor, {
  ChangeHandler,
  EditorDidMount
} from 'react-monaco-editor'
import { withStyles } from '@material-ui/core'

const styles = {}

class App extends Component<{}, { code: string }> {
  state = {
    code: '// type your code...',
  }

  editorDidMount: EditorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor)
    editor.focus()
  }

  onChange: ChangeHandler = (newValue, e) => {
    console.log('onChange', newValue, e)
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

export default withStyles(styles)(App)

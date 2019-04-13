import MonacoEditor, { EditorDidMount } from 'react-monaco-editor'
import { compose } from 'redux'
import { withStyles, WithStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { getSynchronizer } from '../codeSynchronizer'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { State } from '../redux/types'
import { EditorState, ObjectOf, Tab, TaskFile } from '../types/common'
import classNames from 'classnames'
import { forEach } from 'lodash'
import { activeTabSelector } from '../selectors/tabSelectors'
import { addEditorInstance as _addEditorInstance } from '../actions/editorActions'

const styles = (theme: Theme) => ({
  wrapper: {
    width: '100%',
    height: '100%',
    // hack to prevent background flashing when changing editor tabs
    backgroundColor: theme.colors.background.editor,
  },
  hidden: {
    display: 'none',
  },
})

interface Props extends WithStyles<typeof styles> {
  files: ObjectOf<TaskFile>
  editors: ObjectOf<EditorState | undefined>
  activeTab?: Tab
  addEditorInstance: typeof _addEditorInstance
}

class EditorScreen extends Component<Props> {
  constructor(props: any) {
    super(props)
  }

  editorDidMount = (id: string): EditorDidMount => async (
    editorRef,
    monacoRef,
  ) => {
    const { files, addEditorInstance } = this.props

    const synchronizer = await getSynchronizer(id)
    await synchronizer!.share.textarea.bindMonaco(
      editorRef,
      () => editorRef.setValue(files[id].content),
      id,
    )

    addEditorInstance(id, { editorRef, monacoRef, synchronizer })
  }

  handleResize = () => {
    forEach(this.props.editors, (editor) => editor && editor.editorRef!.layout())
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    const { activeTab, classes, editors } = this.props
    const options = { selectOnLineNumbers: true }

    // need to trigger editor resize after render otherwise editor has 5px :)
    setTimeout(() => {
      this.handleResize()
    }, 0)

    return Object.keys(editors).map((id) => (
      <div
        className={classNames(classes.wrapper, {
          [classes.hidden]: !activeTab || activeTab.id !== id,
        })}
        key={id}
      >
        <MonacoEditor
          width="100%"
          height="100%"
          // languages needs to be added in webpack too
          language="cpp"
          theme="vs-dark"
          options={options}
          editorDidMount={this.editorDidMount(id)}
        />
      </div>
    ))
  }
}

export default compose(
  withStyles(styles),
  connect(
    (state: State) => ({
      files: state.files,
      editors: state.editors,
      activeTab: activeTabSelector(state),
    }),
    {
      addEditorInstance: _addEditorInstance,
    },
  ),
)(EditorScreen) as any

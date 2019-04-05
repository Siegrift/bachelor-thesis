import React, { Component } from 'react'
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor'
import { withStyles, WithStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { editor as Editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { getSynchronizer, Synchronizer } from '../codeSynchronizer'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { State } from '../redux/types'
import { Tab, TaskFile } from '../types/common'
import classNames from 'classnames'
import { forEach } from 'lodash'

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
  files: { [key: string]: TaskFile }
  activeTab?: Tab
}

interface EditorScreenLocalState {
  editors: {
    [key: string]: {
      initialContent: string;
      editorRef?: Editor.IStandaloneCodeEditor;
      monacoRef?: typeof import('/home/siegrift/Documents/bachelor-thesis/frontend/node_modules/monaco-editor/esm/vs/editor/editor.api');
      synchronizer?: Synchronizer;
    };
  }
}

class EditorScreen extends Component<Props, EditorScreenLocalState> {
  constructor(props: any) {
    super(props)
    this.state = { editors: {} }
  }

  editorDidMount = (id: string): EditorDidMount => async (editor, monaco) => {
    const { editors } = this.state

    console.log('mounting: ', id)
    const synchronizer = await getSynchronizer(id)
    // when yjs synchronizes with monaco, it clears the editor and triggers onChange handler
    await synchronizer!.share.textarea.bindMonaco(
      editor,
      // TODO: editors[id].initialContent
      () => editor.setValue(''),
      id,
    )

    this.setState((state) => ({
      editors: {
        ...state.editors,
        [id]: {
          ...state.editors[id],
          editorRef: editor,
          monacoRef: monaco,
          synchronizer,
        },
      },
    }))

    editor.focus()
  }

  handleResize = () => {
    forEach(
      this.state.editors,
      ({ editorRef }) => editorRef && editorRef!.layout(),
    )
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  componentDidUpdate(prevProps: Props) {
    const { files } = this.props
    const { editors } = this.state

    // create an editor instance for each new donwloaded file from internet
    forEach(files, (file, key) => {
      if (editors[key] === undefined) {
        this.setState((state) => ({
          editors: {
            ...state.editors,
            [key]: {
              initialContent: file.content,
            },
          },
        }))
      }
    })
  }

  render() {
    const { activeTab, classes } = this.props
    const { editors } = this.state
    const options = { selectOnLineNumbers: true }

    // need to trigger editor resize after render otherwise editor has 5px :)
    setTimeout(() => {
      this.handleResize()
    }, 0)

    if (!activeTab) return null
    else {
      return Object.keys(editors).map((id) => (
        <div
          className={classNames(
            classes.wrapper,
            activeTab.id !== id && classes.hidden,
          )}
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
}

export default compose(
  withStyles(styles),
  connect((state: State) => ({
    files: state.files,
    activeTab: state.tabs.find((tab) => tab.active),
  })),
)(EditorScreen) as any

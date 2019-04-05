import React, { Component } from 'react'
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor'
import { withStyles, WithStyles } from '@material-ui/core'
import { editor as Editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { getSynchronizer, Synchronizer } from '../codeSynchronizer'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { State } from '../redux/types'
import { Tab } from '../types/common'
import { find } from 'lodash'

const styles = {}

interface Props extends WithStyles<typeof styles> {
  files: { [key: string]: string }
  activeTab?: Tab
}

interface LocalState {
  models: {
    [key: string]: {
      model: Editor.ITextModel;
      state?: Editor.ICodeEditorViewState;
    };
  }
  // yjs will asynchronously trigger an onChange on monaco editor clearing the model
  // to prevent this we wait for the first tick of onChange handler
  yjsInitializationFinished: boolean
}

class EditorScreen extends Component<Props, LocalState> {
  editorRef?: Editor.IStandaloneCodeEditor
  monacoRef?: typeof import('/home/siegrift/Documents/bachelor-thesis/frontend/node_modules/monaco-editor/esm/vs/editor/editor.api')
  synchronizer?: Synchronizer

  constructor(props: any) {
    super(props)
    this.state = { models: {}, yjsInitializationFinished: false }
  }

  editorDidMount: EditorDidMount = async (editor, monaco) => {
    this.editorRef = editor
    this.monacoRef = monaco

    // when yjs synchronizes with monaco, it clears the editor and triggers onChange handler
    this.synchronizer = await getSynchronizer()
    await this.synchronizer!.share.textarea.bindMonaco(this.editorRef!)
    this.setState({ yjsInitializationFinished: true })
    this.initializeEditor()

    editor.focus()
  }

  initializeEditor = () => {
    const { activeTab } = this.props

    console.log('Initializing!')
    this.setState({ yjsInitializationFinished: true })
    this.updateEditorModels()
    console.log('Setting model', this.state.models[activeTab!.id].model)
    this.editorRef!.setModel(this.state.models[activeTab!.id].model)
  }

  updateEditorModels = () => {
    const { files } = this.props
    const { models } = this.state

    Object.keys(files).forEach((key) => {
      if (models[key] === undefined) {
        this.setState((state) => ({
          models: {
            ...state.models,
            ...{
              [key]: {
                // TODO: yjs doesn't know anything about models, and tries to set editor value
                // this is a problem  because users can have different tabs open
                // TODO: this should be files[key]
                model: this.monacoRef!.editor.createModel('', 'cpp'),
              },
            },
          },
        }))
      }
    })
  }

  handleResize = () => this.editorRef!.layout()

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  componentDidUpdate(prevProps: Props) {
    const { activeTab } = this.props
    const { models, yjsInitializationFinished } = this.state

    if (!yjsInitializationFinished) return

    this.updateEditorModels()
    if (
      activeTab &&
      prevProps.activeTab !== activeTab &&
      models[activeTab.id]
      // TODO: uncomment && models[activeTab.id].state
    ) {
      console.log(prevProps.activeTab, activeTab)
      this.editorRef!.setModel(models[activeTab.id].model)
      // TODO: uncomment this.editorRef.restoreViewState(models[activeTab.id].state!)
    }
  }

  render() {
    const { activeTab } = this.props
    const { models } = this.state
    const options = { selectOnLineNumbers: true }
    const activeModel = find(
      models,
      (_, key) => activeTab !== undefined && key === activeTab.id,
    )

    return (
      <MonacoEditor
        width="100%"
        height="100%"
        // languages needs to be added in webpack too
        language="cpp"
        theme="vs-dark"
        options={options}
        editorDidMount={this.editorDidMount}
      />
    )
  }
}

export default compose(
  withStyles(styles),
  connect((state: State) => ({
    files: state.files,
    activeTab: state.tabs.find((tab) => tab.active),
  })),
)(EditorScreen) as any

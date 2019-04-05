import React, { Component } from 'react'
import MonacoEditor, {
  ChangeHandler,
  EditorDidMount
} from 'react-monaco-editor'
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
    this.synchronizer!.share.textarea.bindMonaco(this.editorRef!)
    editor.focus()
  }

  onChange: ChangeHandler = (newValue, edits) => {
    const { yjsInitializationFinished } = this.state

    if (!yjsInitializationFinished) {
      this.setState({ yjsInitializationFinished: true })
      this.createModels()
    }

    this.updateActiveModel(newValue)
  }

  updateActiveModel = (newValue: string) => {
    const { models } = this.state
    const { activeTab } = this.props

    const activeModel = find(
      models,
      (_, key) => activeTab !== undefined && key === activeTab.id,
    )

    activeModel!.model.setValue(newValue)
  }

  handleResize = () => this.editorRef!.layout()

  createModels = () => {
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

    this.createModels()
    if (
      activeTab &&
      this.editorRef &&
      prevProps.activeTab !== activeTab &&
      models[activeTab.id] &&
      models[activeTab.id].state
    ) {
      this.editorRef.restoreViewState(models[activeTab.id].state!)
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
        value={activeModel ? activeModel.model.getValue() : ''}
        options={options}
        onChange={this.onChange}
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

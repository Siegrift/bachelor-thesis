// NOTE: this file should hold all state interfaces for now
import { editor as Editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { Synchronizer } from '../codeSynchronizer'

export class ApiError {
  reason: string
  response?: Response

  constructor(reason: string, response?: Response) {
    this.reason = reason
    this.response = response
  }
}

export interface ObjectOf<T> {
  [key: string]: T
}

export interface LoginState {
  name: string
  password: string
  repeatPassword: string
  type: 'login' | 'register'
  errorMessage?: string
}

export interface User {
  name: string
  id: string
  isAdmin: boolean
}

export interface Logger {
  log: (reason: string, payload?: any) => void
}

export interface Refetchable {
  fetching: boolean
}

export type Tab = TabNode | TabLeaf
export interface TabNode {
  id: string
  name: string
  children: Tab[]
  toggled?: boolean
  loading?: boolean
}
export interface TabLeaf {
  id: string
  name: string
  selected: boolean
  active: boolean
}

export interface TaskFile {
  name: string
  content: string
  forceLocalInitialization?: boolean
}

export interface EditorState {
  editorRef: Editor.IStandaloneCodeEditor
  monacoRef: typeof import('/home/siegrift/Documents/bachelor-thesis/frontend/node_modules/monaco-editor/esm/vs/editor/editor.api')
  synchronizer: Synchronizer
}

export type DialogType = 'save' | 'load' | 'run' | 'submit' | undefined

export interface PartialUpload {
  id: string
  taskId: string
  userId: string
  createdAt: string
  name: string
  isAutosave: boolean
}

export interface Upload extends PartialUpload {
  files: TaskFile[]
}

export interface UploadsState extends Refetchable {
  uploads: PartialUpload[]
}

export interface SandboxResponse {
  data: string
  executionTime: number
  error: string
}

export interface SubmitResponse {
  result: string
  input: number
}

export interface Group {
  id: string
  name: string
}

export interface PartialTask {
  id: string
  name: string
  groupId: string
}
export interface Task extends PartialTask {
  files: TaskFile[]
}

export interface UserGroup {
  id: string
  groupId: string
  userId: string
}

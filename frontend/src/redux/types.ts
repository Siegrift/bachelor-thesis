import {
  EditorState,
  Logger,
  LoginState,
  ObjectOf,
  Tab,
  TaskFile,
  User
} from '../types/common'
import { Api } from '../api'

export interface State {
  readonly login: LoginState
  readonly user?: User
  readonly tabs: Tab[]
  readonly files: ObjectOf<TaskFile>
  /** Properties of this object are populated lazily */
  readonly editors: ObjectOf<EditorState | undefined>
}

export type Path = string[]
export interface Action<Payload = undefined> {
  type: string
  loggable?: boolean
  payload?: Payload
  reducer: (state: State) => State
}

export interface ThunkExtra {
  logger: Logger
  api: Api
}

export type Thunk = (
  dispatch: (action: any) => void,
  getState: () => State,
  e: ThunkExtra,
) => Promise<void>

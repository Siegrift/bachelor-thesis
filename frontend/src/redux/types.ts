import {
  DialogType,
  EditorState,
  Group,
  Logger,
  LoginState,
  ObjectOf,
  PartialProblem,
  Problem,
  ProblemFile,
  Tab,
  UploadState,
  User
} from '../types/common'
import { Api } from '../api'

export interface State {
  readonly login: LoginState
  readonly user?: User
  readonly tabs: Tab[]
  readonly files: ObjectOf<ProblemFile>
  /** Properties of this object are populated lazily */
  readonly editors: ObjectOf<EditorState | undefined>
  readonly dialog: DialogType
  readonly uploads: UploadState
  readonly leftPanelExpanded: boolean
  readonly rightPanelExpanded: boolean
  readonly groups: ObjectOf<Group>
  readonly problems: ObjectOf<PartialProblem[]>
  readonly selectedProblemId?: string
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

export type Thunk<PromiseType = void> = (
  dispatch: (action: any) => any,
  getState: () => State,
  e: ThunkExtra,
) => Promise<PromiseType>

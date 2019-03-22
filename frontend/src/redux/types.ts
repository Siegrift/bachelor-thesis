import { Logger, LoginState } from '../types/common'

export interface State {
  readonly login: LoginState
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
}

export type Thunk = (
  dispatch: (action: any) => void,
  getState: () => State,
  e: ThunkExtra,
) => Promise<void>

export interface State {}

export type Path = string[]
export interface Action<Payload = undefined> {
  type: string
  loggable?: boolean
  payload?: Payload
  reducer: (state: State) => State
}

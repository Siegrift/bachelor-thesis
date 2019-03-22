import produce, { createDraft } from 'immer'

export interface State {}

export type StateModifier = (state: State) => void

let state: State = {}

export const modifyState = (stateModifier: StateModifier) => {
  state = produce(state, stateModifier)
}

export const getState = () => createDraft(state)

import getInitialState from './initialState'
import { Action, State } from './types'

const rootReducer = (state: State = getInitialState(), action: Action) => {
  if (!action.reducer) return state // fallback for actions from different sources
  return action.reducer(state)
}

export default rootReducer

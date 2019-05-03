import { Action, Path, State } from '../redux/types'
import { assocPath } from 'ramda'

interface SetValueOptions {
  type?: string
  loggable?: boolean
}

const isLoggable = (options?: SetValueOptions) => {
  if (options && options.hasOwnProperty('loggable')) {
    return options.loggable as boolean
  }
  return true
}

export function updateValue<Value>(
  path: Path,
  value: Value,
  other?: SetValueOptions,
): Action<Value> {
  return {
    loggable: isLoggable(other),
    payload: value,
    type: (other && other.type) || `Set value at ${JSON.stringify(path)}`,
    reducer: (state: State) => assocPath(path, value, state),
  }
}

import { State } from './types'

const state: State = {
  login: {
    name: '',
    password: '',
    repeatPassword: '',
    type: 'login',
    errorMessage: undefined,
  },
  user: undefined,
  tabs: [],
  files: {},
  editors: {},
  dialog: undefined,
  uploads: {
    entries: [],
    fetching: false,
  },
}

export default () => state

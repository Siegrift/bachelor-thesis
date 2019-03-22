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
}

export default () => state

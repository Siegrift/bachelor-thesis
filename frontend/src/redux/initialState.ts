import { State } from './types'

const state: State = {
  login: {
    name: '',
    password: '',
    repeatPassword: '',
    type: 'login',
  },
}

export default () => state

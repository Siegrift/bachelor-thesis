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
  uploadsState: {
    uploads: [],
    fetching: false,
  },
  leftPanelExpanded: true,
  rightPanelExpanded: true,
  groups: {},
  tasks: {},
  selectedTaskId: undefined,
}

export default () => state

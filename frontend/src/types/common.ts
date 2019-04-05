// NOTE: for now should hold all state interfaces
export class ApiError {
  reason: string
  response?: Response

  constructor(reason: string, response?: Response) {
    this.reason = reason
    this.response = response
  }
}
export interface LoginState {
  name: string
  password: string
  repeatPassword: string
  type: 'login' | 'register'
  errorMessage?: string
}

export interface User {
  name: string
  password: string
  id: string
  isAdmin: boolean
}

export interface Logger {
  log: (reason: string, payload?: any) => void
}

export type Tab = TabNode | TabLeaf
export interface TabNode {
  id: string
  name: string
  children: Tab[]
  toggled?: boolean
  loading?: boolean
}
export interface TabLeaf {
  id: string
  name: string
  selected: boolean
  active: boolean
}

export interface TaskFile {
  name: string
  content: string
}

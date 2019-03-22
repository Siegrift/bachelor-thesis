// NOTE: for now should hold all state interfaces

export interface LoginState {
  name: string
  password: string
  repeatPassword: string
  type: 'login' | 'register'
}

export interface Logger {
  log: (message: string, payload?: any) => void
}

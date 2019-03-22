import { Action, Thunk } from '../redux/types'

export const toggleFormType = (): Action<void> => ({
  type: `Change login form type`,
  reducer: (state) => ({
    ...state,
    login: {
      ...state.login,
      type: state.login.type === 'login' ? 'register' : 'login',
    },
  }),
})

export const loginUser = (): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Login user')
}

export const registerUser = (): Thunk => async (
  dispatch,
  getState,
  { logger },
) => {
  logger.log('Register user')
}

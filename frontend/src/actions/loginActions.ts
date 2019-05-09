import { Action, Thunk } from '../redux/types'
import { updateValue } from './sharedActions'
import { ApiError } from '../types/common'

export const toggleFormType = (): Action<void> => ({
  type: `Change login form type`,
  reducer: (state) => ({
    ...state,
    login: {
      ...state.login,
      type: state.login.type === 'login' ? 'register' : 'login',
      errorMessage: undefined,
    },
  }),
})

export const loginUser = (): Thunk => async (
  dispatch,
  getState,
  { logger, api },
) => {
  const state = getState().login

  try {
    const user = await api.loginUser({
      name: state.name,
      password: state.password,
    })

    dispatch(updateValue(['user'], user))
  } catch (err) {
    if (err instanceof ApiError) {
      dispatch(updateValue(['login', 'errorMessage'], await err.reason))
    }
  }
}

export const registerUser = (): Thunk => async (
  dispatch,
  getState,
  { logger, api },
) => {
  const state = getState().login

  try {
    const user = await api.registerUser({
      name: state.name,
      password: state.password,
      repeatPassword: state.repeatPassword,
    })

    dispatch(updateValue(['user'], user))
  } catch (err) {
    if (err instanceof ApiError) {
      dispatch(updateValue(['login', 'errorMessage'], await err.reason))
    }
  }
}

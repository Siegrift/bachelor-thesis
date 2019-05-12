import { Action, State, Thunk } from '../redux/types'
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

export const createUser = (): Thunk => async (
  dispatch,
  getState,
  { logger, api },
) => {
  const state = getState().login

  try {
    const user = await api.createUser({
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

export const getUserGroupsAndProblems = (): Thunk => async (
  dispatch,
  getState,
  { logger, api },
) => {
  const user = getState().user
  if (!user) throw new Error('User should exist in state!')

  const userGroups = await api.getUserGroups({ userId: user.id })
  const groups = await Promise.all(
    userGroups.map((userGroup) => api.getGroup(userGroup.groupId)),
  )
  dispatch(
    updateValue(
      ['groups'],
      groups.reduce((acc, g) => ({ ...acc, [g.id]: g }), {}),
    ),
  )

  const problemsInGroups = await Promise.all(
    groups.map(async (group) => ({
      groupId: group.id,
      problems: await api.getProblems({ groupId: group.id }),
    })),
  )
  dispatch(
    updateValue(
      ['problems'],
      problemsInGroups.reduce(
        (acc, p) => ({ ...acc, [p.groupId]: p.problems }),
        {},
      ),
    ),
  )
}

export const setSelectedProblemId = (problemId: string): Action<string> => ({
  type: 'Set selected problem id',
  payload: problemId,
  reducer: (state: State) => ({ ...state, selectedProblemId: problemId }),
})

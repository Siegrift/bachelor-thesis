import { Action, Thunk } from '../redux/types'
import uuid from 'uuid/v4'
import { Tab } from '../types/common'
import { updateValue } from './sharedActions'

const createEditorTabs = (tabNames: string[], ids: string[]): Action<any> => ({
  type: 'Create editor tabs from response',
  payload: { tabNames, ids },
  reducer: (state) => {
    const tabs = tabNames.map(
      (tab, i): Tab => ({
        id: ids[i],
        name: tab,
        active: i === 0,
        selected: i === 0,
      }),
    )
    return { ...state, tabs }
  },
})

export const downloadTaskFiles = (): Thunk => async (
  dispatch,
  getState,
  { api },
) => {
  try {
    const taskFiles = await api.downloadTaskFiles()
    const ids = taskFiles.map((_) => uuid())

    dispatch(createEditorTabs(taskFiles, ids))

    taskFiles.forEach(async (file, i) => {
      const content = await api.getFile(file)
      dispatch(updateValue(['files', ids[i]], content))
    })
  } catch (err) {
    console.log('Error fetching andle error', err)
  }
}

export const closeTab = (tabId: string): Action<string> => ({
  type: 'Close editor tab',
  payload: tabId,
  reducer: (state) => {
    let shouldChangeActiveTab = state.tabs.find((tab) => tab.id === tabId)!
      .active
    const shouldNotCloseTab =
      state.tabs.filter((tab) => tab.selected).length === 1
    const tabs = state.tabs.map(
      (tab): Tab => {
        if (shouldNotCloseTab) return tab
        else if (tab.id === tabId) {
          return { ...tab, selected: false, active: false }
        } else if (tab.selected && shouldChangeActiveTab) {
          shouldChangeActiveTab = false
          return { ...tab, active: true }
        } else {
          return tab
        }
      },
    )
    return { ...state, tabs }
  },
})

// TODO: this also needs to expand directories in tree view, and should probably be renamed
export const selectTab = (tabId: string): Action<string> => ({
  type: 'Select editor tab',
  payload: tabId,
  reducer: (state) => {
    const tabs = state.tabs.map(
      (tab): Tab =>
        tab.id === tabId
          ? { ...tab, selected: true, active: true }
          : { ...tab, active: false },
    )
    return { ...state, tabs }
  },
})

export const setActiveTab = (tabId: string): Action<string> => ({
  type: 'Activate editor tab',
  payload: tabId,
  reducer: (state) => {
    const tabs = state.tabs.map(
      (tab): Tab =>
        tab.id === tabId ? { ...tab, active: true } : { ...tab, active: false },
    )
    return { ...state, tabs }
  },
})

import { Action, Thunk } from '../redux/types'
import { Tab, TaskFile } from '../types/common'
import { updateValue } from './sharedActions'
import { filterTabs, findTab, mapTabs } from '../tabHelpers'

// NOTE: there can't be 2 files with same name in the same directory
// for this reason we are using the file path as an id
const addTabToContainer = (
  container: Tab[],
  rawPath: string,
  remainingPath: string[],
  selected: boolean,
) => {
  const [first, ...rest] = remainingPath
  if (remainingPath.length > 1) {
    const dirTab = container.find((tab) => tab.name === first)
    if (dirTab) addTabToContainer(dirTab.children!, rawPath, rest, selected)
    else {
      const tab = {
        id: first,
        name: first,
        children: [],
      }
      addTabToContainer(tab.children, rawPath, rest, selected)
      container.push(tab)
    }
  } else {
    container.push({
      id: rawPath,
      name: first,
      active: selected,
      selected,
    })
  }
}

const createEditorTabs = (taskFilesPaths: string[]): Action<any> => ({
  type: 'Create editor tabs from response',
  payload: taskFilesPaths,
  reducer: (state) => {
    const tabs: Tab[] = []
    taskFilesPaths.forEach((path, i) =>
      addTabToContainer(tabs, path, path.split('/'), i === 0),
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
    dispatch(createEditorTabs(taskFiles))

    // we want to do this asynchronously so that we are not blocking the editor
    taskFiles.forEach(async (file, i) => {
      const content = await api.getFile(file)
      dispatch(
        updateValue(['files', taskFiles[i]], {
          name: taskFiles[i],
          content,
        } as TaskFile),
      )
    })
  } catch (err) {
    console.log('Error fetching andle error', err)
  }
}

// FIXME: now wokring
export const closeTab = (tabId: string): Action<string> => ({
  type: 'Close editor tab',
  payload: tabId,
  reducer: (state) => {
    let shouldChangeActiveTab = findTab(state.tabs, (tab) => tab.id === tabId)!
      .active
    const shouldNotCloseTab =
      filterTabs(state.tabs, (tab) => !!tab.selected).length === 1
    const tabs = mapTabs(
      state.tabs,
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

export const selectTab = (tabId: string): Action<string> => ({
  type: 'Select editor tab',
  payload: tabId,
  reducer: (state) => {
    const tabs = mapTabs(state.tabs, (tab) =>
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
    const tabs = mapTabs(
      state.tabs,
      (tab): Tab =>
        tab.id === tabId ? { ...tab, active: true } : { ...tab, active: false },
    )
    return { ...state, tabs }
  },
})

export const toggleTabExpand = (tabId: string): Action<string> => ({
  type: 'Toggle tab expand',
  payload: tabId,
  reducer: (state) => {
    const tabs: Tab[] = mapTabs(
      state.tabs,
      (tab) => (tab.id === tabId ? { ...tab, toggled: !tab.toggled } : tab),
      true,
    )
    return { ...state, tabs }
  },
})

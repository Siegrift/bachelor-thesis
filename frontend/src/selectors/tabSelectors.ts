import { createSelector } from 'reselect'
import { State } from '../redux/types'
import { findTab } from '../tabHelpers'

const tabsSelector = (state: State) => state.tabs

export const activeTabSelector = createSelector(
  tabsSelector,
  (tabs) => findTab(tabs, (tab) => !!tab.active),
)

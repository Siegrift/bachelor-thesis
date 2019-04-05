import { Tab } from './types/common'

export const filterTabs = (
  tabs: Tab[],
  predicate: (tab: Tab) => boolean,
): Tab[] => {
  const res: Tab[] = []
  tabs.forEach((tab) => {
    if (!tab.children && predicate(tab)) {
      res.push(tab)
    } else if (tab.children) {
      res.push(...filterTabs(tab.children, predicate))
    }
  })
  return res
}

export const findTab = (
  tabs: Tab[],
  predicate: (tab: Tab) => boolean,
): Tab | undefined => {
  return filterTabs(tabs, predicate)[0]
}

export const mapTabs = (
  tabs: Tab[],
  predicate: (tab: Tab) => Tab,
  traverseNodes?: boolean,
): Tab[] => {
  return tabs.map((tab) => {
    if (!tab.children) {
      return predicate(tab)
    } else {
      return {
        ...(traverseNodes ? predicate(tab) : tab),
        children: mapTabs(tab.children, predicate),
      }
    }
  })
}

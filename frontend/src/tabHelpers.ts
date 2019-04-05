import { Tab, TabLeaf, TabNode } from './types/common'

export function isTabLeaf(tab: Tab): tab is TabLeaf {
  return (tab as any).children === undefined
}

export function isTabNode(tab: Tab): tab is TabNode {
  return !isTabLeaf(tab)
}

export const filterTabs = (
  tabs: Tab[],
  predicate: (tab: TabLeaf) => boolean,
): TabLeaf[] => {
  const res: TabLeaf[] = []
  tabs.forEach((tab) => {
    if (isTabLeaf(tab) && predicate(tab)) {
      res.push(tab)
    } else if (isTabNode(tab)) {
      res.push(...filterTabs(tab.children, predicate))
    }
  })
  return res
}

export const findTab = (
  tabs: Tab[],
  predicate: (tab: TabLeaf) => boolean,
): TabLeaf | undefined => {
  return filterTabs(tabs, predicate)[0]
}

export const mapTabs = (
  tabs: Tab[],
  predicate: (tab: Tab) => Tab,
  traverseNodes?: boolean,
): Tab[] => {
  return tabs.map((tab) => {
    if (isTabLeaf(tab)) {
      return predicate(tab)
    } else {
      return {
        ...(traverseNodes ? predicate(tab) : tab),
        children: mapTabs(tab.children, predicate),
      }
    }
  })
}

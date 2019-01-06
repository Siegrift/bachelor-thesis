import React from 'react'
import { HotKeys } from 'react-hotkeys'
import { mapObjIndexed } from 'ramda'

const preventDefaultFn = (event?: KeyboardEvent) => {
  if (event) event.preventDefault()
}

const captures = {
  save: 'ctrl+s',
}
const handlers = mapObjIndexed(() => preventDefaultFn, captures)

export const CaptureKeysHOC = (WrappedComponent: any) => {
  return class extends React.Component {
    render() {
      return (
        <HotKeys keyMap={captures} handlers={handlers}>
          <WrappedComponent />
        </HotKeys>
      )
    }
  }
}

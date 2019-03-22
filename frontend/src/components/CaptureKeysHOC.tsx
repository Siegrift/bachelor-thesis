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

const HotKeysUntyped = HotKeys as any
export const CaptureKeysHOC = (WrappedComponent: any) => {
  return class extends React.Component {
    render() {
      return (
        <HotKeysUntyped
          keyMap={captures}
          handlers={handlers}
          style={{ width: '100%', height: `100%` }}
        >
          <WrappedComponent />
        </HotKeysUntyped>
      )
    }
  }
}

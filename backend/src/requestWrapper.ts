import { NextFunction, Request, RequestHandler, Response } from 'express'
import { getState, modifyState, State } from './state'

interface EndpointHandlerProps {
  request: Request
  response: Response
  nextHandler: NextFunction
  state: State
}
export type ModifyingEndpointHandler = (args: EndpointHandlerProps) => State
export type BasicEndpointHandler = (args: EndpointHandlerProps) => void

export const stateModifyingRequest = (
  requestHandler: ModifyingEndpointHandler,
): RequestHandler => (request, response, nextHandler) => {
  modifyState((state) => {
    return requestHandler({ request, response, nextHandler, state })
  })
}

export const basicRequest = (
  requestHandler: BasicEndpointHandler,
): RequestHandler => (request, response, nextHandler) => {
  requestHandler({ request, response, nextHandler, state: getState() })
}

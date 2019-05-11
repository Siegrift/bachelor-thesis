import { NextFunction, Request, RequestHandler, Response } from 'express'

interface EndpointHandlerProps {
  request: Request
  response: Response
  nextHandler: NextFunction
}
export type BasicEndpointHandler = (args: EndpointHandlerProps) => void

export const basicRequest = (
  requestHandler: BasicEndpointHandler,
): RequestHandler => (request, response, nextHandler) => {
  requestHandler({ request, response, nextHandler })
}

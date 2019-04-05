import { ApiError, Logger } from './types/common'
import { BASE_URL, REQUEST_TIMEOUT } from './constants'

interface LoginUserRequest {
  name: string
  password: string
}

type RegisterUserRequest = LoginUserRequest

interface RequestOptions {
  body?: any
  headers?: { [key: string]: string }
  responseAsText?: boolean
}

export class Api {
  readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  async loginUser(user: LoginUserRequest) {
    return this.request(`/login`, 'POST', { body: user })
  }

  async registerUser(user: RegisterUserRequest) {
    return this.request(`/register`, 'POST', { body: user })
  }

  async downloadTaskFiles(): Promise<string[]> {
    return this.request('/mockedFiles', 'GET')
  }

  async getFile(file: string): Promise<string> {
    return this.request(`/mockedFiles/${file}`, 'GET', {
      responseAsText: true,
    })
  }

  private request(
    url: string,
    method: string,
    reqOptions: RequestOptions = {},
  ) {
    const { body, headers, responseAsText } = reqOptions

    const uri = `${BASE_URL}${url}`
    const options = {
      method,
      headers: new Headers({
        ['Content-Type']: 'application/json',
        ...headers,
      }),
      body: body ? JSON.stringify(body) : undefined,
    }
    return Promise.race([
      fetch(uri, options).then(async (response) => {
        this.logger.log(`Fetch - ${method} ${uri}`, {
          request: { uri, options },
          response,
        })

        if (response.status >= 200 && response.status < 300) {
          return responseAsText ? response.text() : response.json()
        } else {
          throw new ApiError(await response.text(), response)
        }
      }),
      new Promise((_, rej) => {
        setTimeout(() => {
          rej(new ApiError(`Žiadna odpoveď zo servera!`))
        }, REQUEST_TIMEOUT)
      }),
    ])
  }
}

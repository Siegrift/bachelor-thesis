import { ApiError, Logger, ObjectOf, SandboxResponse } from './types/common'
import { BASE_URL, DEFAULT_REQUEST_TIMEOUT } from './constants'

interface LoginUserRequest {
  name: string
  password: string
}

type RegisterUserRequest = LoginUserRequest

interface RequestOptions {
  body?: any
  headers?: ObjectOf<string>
  responseAsText?: boolean
  convertToJson?: boolean
  timeout?: number
}

export class Api {
  readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  loginUser(user: LoginUserRequest) {
    return this.request(`/login`, 'POST', {
      body: user,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  registerUser(user: RegisterUserRequest) {
    return this.request(`/register`, 'POST', {
      body: user,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  downloadTaskFiles(): Promise<string[]> {
    return this.request('/mockedFiles', 'GET')
  }

  getFile(file: string): Promise<string> {
    return this.request(`/mockedFiles/${encodeURIComponent(file)}`, 'GET', {
      responseAsText: true,
    })
  }

  saveFiles(files: FormData) {
    return this.request(`/saveFiles`, 'POST', {
      body: files,
      convertToJson: false,
      responseAsText: true,
    })
  }

  runSavedCode(folder: string, customInput: string): Promise<SandboxResponse> {
    return this.request(`/runSavedCode/${folder}`, 'POST', {
      timeout: 10000,
      body: customInput,
      convertToJson: false,
    })
  }

  listUploads(): Promise<string[]> {
    return this.request('/uploads', 'GET')
  }

  listUploadFiles(upload: string): Promise<string[]> {
    return this.request(`/uploads/${upload}`, 'GET')
  }

  downloadUploadFile(upload: string, filename: string): Promise<string> {
    return this.request(
      `/uploads/${upload}/${encodeURIComponent(filename)}`,
      'GET',
      {
        responseAsText: true,
      },
    )
  }

  private createRequestBody({ body, convertToJson = true }: RequestOptions) {
    // test undefined explicitely as empty string is valid body
    if (body === undefined) return undefined
    if (!convertToJson) return body
    return JSON.stringify(body)
  }

  private request(
    url: string,
    method: 'POST' | 'GET',
    reqOptions: RequestOptions = {},
  ) {
    const {
      headers,
      responseAsText,
      timeout = DEFAULT_REQUEST_TIMEOUT,
    } = reqOptions

    const uri = encodeURI(`${BASE_URL}${url}`)
    const options = {
      method,
      headers: new Headers({
        ...headers,
      }),
      body: this.createRequestBody(reqOptions),
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
        }, timeout)
      }),
    ])
  }
}

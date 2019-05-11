import { stringify } from 'query-string'
import {
  ApiError,
  Group,
  Logger,
  ObjectOf,
  SandboxResponse,
  SubmitResponse
} from './types/common'
import { BASE_URL, DEFAULT_REQUEST_TIMEOUT } from './constants'
import { merge } from 'lodash'

interface LoginUserRequest {
  name: string
  password: string
}

interface RegisterUserRequest extends LoginUserRequest {
  repeatPassword: string
}

interface GetGroupsRequest {
  name: string
  exact: boolean
}

interface RequestOptions {
  body?: any
  headers?: ObjectOf<string>
  responseAsText?: boolean
  convertToJson?: boolean
  timeout?: number
  queryParams?: any
}

// NOTE: personal advice is to create instance of this class from redux store. Use the exported
// helpers to get the api outside of redux.
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

  submitCode(folder: string): Promise<SubmitResponse> {
    return this.request(`/submit/${folder}`, 'POST', {
      timeout: 10000,
    })
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

  getGroups(params: GetGroupsRequest): Promise<Group[]> {
    return this.request(`/groups`, 'GET', {
      queryParams: params,
    })
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
      queryParams,
    } = reqOptions

    const uri = encodeURI(
      `${BASE_URL}${url}${queryParams ? `?${stringify(queryParams)}` : ''}`,
    )
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

let apiInstance: Api | undefined

export const createApi = (logger: Logger): Api => {
  apiInstance = new Api(logger)
  return apiInstance
}

export const getApi = (): Api => {
  if (apiInstance === undefined) throw new Error('API has not been created!')
  return apiInstance
}

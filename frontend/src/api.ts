import { stringify } from 'query-string'
import {
  ApiError,
  Group,
  Logger,
  ObjectOf,
  PartialTask,
  PartialUpload,
  SandboxResponse,
  SubmitResponse,
  Task,
  Upload,
  User,
  UserGroup
} from './types/common'
import {
  BASE_URL,
  DEFAULT_REQUEST_TIMEOUT,
  SAVE_ENTRY_AS_KEY
} from './constants'
import { convertToCamelCase } from './utils'
import { exact } from 'prop-types'

export interface LoginUserRequest {
  name: string
  password: string
}

export interface CreateUserRequest extends LoginUserRequest {
  repeatPassword: string
}

export interface GetGroupsRequest {
  name?: string
  exact?: boolean
  userId?: string
}

export type GetUsersRequest = GetGroupsRequest

export interface GetUserGroupsRequest {
  groupId?: string
  userId?: string
  conjunction?: boolean
  exact?: boolean
}

export interface GetTasksRequest {
  name?: string
  exact?: boolean
  groupId?: string
}

interface RequestOptions {
  body?: any
  headers?: ObjectOf<string>
  responseAsText?: boolean
  timeout?: number
  queryParams?: any
}

interface RunSavedCodeRequestBody {
  input: string
  uploadId: string
  taskId: string
}

interface SubmitRequestBody {
  userId: string
  uploadId: string
  taskId: string
}

interface GetUploadsRequest {
  userId: string
  taskId: string
  conjunction: boolean
  exact: boolean
}

interface CreateUploadRequestBody {
  [SAVE_ENTRY_AS_KEY]: string
  files: ObjectOf<string>
  taskId: string
  userId: string
  createdAt: string
  isAutosave: boolean
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
    })
  }

  createUser(user: CreateUserRequest) {
    return this.request(`/users`, 'POST', {
      body: user,
    })
  }

  getTask(taskId: string): Promise<Task> {
    return this.request(`/tasks/${taskId}/public`, 'GET')
  }

  // TODO: return type
  createUpload(body: CreateUploadRequestBody) {
    return this.request(`/uploads`, 'POST', {
      body,
    })
  }

  runSavedCode(body: RunSavedCodeRequestBody): Promise<SandboxResponse> {
    return this.request(`/runSavedCode`, 'POST', {
      timeout: 10000,
      body,
    })
  }

  getUploads(params: GetUploadsRequest): Promise<PartialUpload[]> {
    return this.request('/uploads', 'GET', {
      queryParams: params,
    })
  }

  getUpload(upload: string): Promise<Upload> {
    return this.request(`/uploads/${upload}`, 'GET')
  }

  submitCode(body: SubmitRequestBody): Promise<SubmitResponse> {
    return this.request(`/submit`, 'POST', {
      timeout: 10000,
      body,
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

  getUsers(params: GetUsersRequest): Promise<User[]> {
    return this.request(`/users`, 'GET', {
      queryParams: params,
    })
  }

  getUserGroups(params: GetUserGroupsRequest): Promise<UserGroup[]> {
    return this.request(`/userGroups`, 'GET', {
      queryParams: params,
    })
  }

  getTasks(params: GetTasksRequest): Promise<PartialTask[]> {
    return this.request('/tasks', 'GET', {
      queryParams: params,
    })
  }

  getGroup(groupId: string): Promise<Group> {
    return this.request(`/groups/${groupId}`, 'GET')
  }

  private createRequestBody({ body }: RequestOptions) {
    // test undefined explicitely as empty string is valid body
    if (body === undefined) return undefined
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
        'Content-Type': 'application/json',
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
          return responseAsText
            ? response.text()
            : convertToCamelCase(await response.json())
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

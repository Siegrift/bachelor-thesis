export interface CreateUserRequest {
  name: string
  password: string
  repeatPassword: string
}
export function isCreateUserRequest(arg: any): arg is CreateUserRequest {
  return arg.name && arg.password
}

export type LoginUserRequest = CreateUserRequest
export function isLoginUserRequest(arg: any): arg is LoginUserRequest {
  return arg.name && arg.password
}

export interface UpdateUserRequest {
  name: string
  password?: string
  groups: string[]
}
export function isUpdateUserRequest(arg: any): arg is UpdateUserRequest {
  return arg.name && Array.isArray(arg.groups)
}

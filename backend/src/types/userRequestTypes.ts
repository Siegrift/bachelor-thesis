export interface LoginUserRequest {
  name: string
  password: string
  repeatPassword: string
}
export function isLoginUserRequest(arg: any): arg is LoginUserRequest {
  return arg.name && arg.password
}

export type RegisterUserRequest = LoginUserRequest
export function isRegisterUserRequest(arg: any): arg is RegisterUserRequest {
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

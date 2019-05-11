export interface CreateGroupRequest {
  name: string
}
export function isCreateGroupRequest(arg: any): arg is CreateGroupRequest {
  return arg.name
}

export interface UpdateGroupRequest {
  name: string
  id: string
}
export function isUpdateGroupRequest(arg: any): arg is UpdateGroupRequest {
  return arg.name
}

import { every } from 'lodash'

export interface TaskFile {
  name: string
  content?: string
}
export interface UpdateTaskRequest {
  id: string
  name: string
  group_id: string
  files: TaskFile[]
}
export function isUpdateTaskRequest(arg: any): arg is UpdateTaskRequest {
  return (
    arg.id &&
    arg.name &&
    arg.group_id &&
    Array.isArray(arg.files) &&
    every(arg.files, (f: any) => f.name !== undefined)
  )
}

export interface CreateTaskRequest {
  name: string
  groupId: string
  files: TaskFile[]
}
export function isCreateTaskRequest(arg: any): arg is CreateTaskRequest {
  return (
    arg.name &&
    arg.groupId &&
    Array.isArray(arg.files) &&
    every(arg.files, (f: any) => f.name !== undefined)
  )
}

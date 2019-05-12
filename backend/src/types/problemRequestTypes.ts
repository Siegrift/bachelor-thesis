import { every } from 'lodash'

export interface ProblemFile {
  name: string
  content?: string
}
export interface UpdateProblemRequest {
  id: string
  name: string
  groupId: string
  files: ProblemFile[]
}
export function isUpdateProblemRequest(arg: any): arg is UpdateProblemRequest {
  return (
    arg.id &&
    arg.name &&
    arg.groupId &&
    Array.isArray(arg.files) &&
    every(arg.files, (f: any) => f.name !== undefined)
  )
}

export interface CreateProblemRequest {
  name: string
  groupId: string
  files: ProblemFile[]
}
export function isCreateProblemRequest(arg: any): arg is CreateProblemRequest {
  return (
    arg.name &&
    arg.groupId &&
    Array.isArray(arg.files) &&
    every(arg.files, (f: any) => f.name !== undefined)
  )
}

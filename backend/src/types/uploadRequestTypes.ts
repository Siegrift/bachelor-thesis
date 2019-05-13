import { SAVE_ENTRY_AS_KEY } from '../constants'

export interface CreateUploadRequest {
  [SAVE_ENTRY_AS_KEY]: string
  files: { [key: string]: string }
  taskId: string
  userId: string
  createdAt: string
  isAutosave: boolean
}
export function isCreateUploadRequest(arg: any): arg is CreateUploadRequest {
  return arg[SAVE_ENTRY_AS_KEY] && arg.files && arg.taskId && arg.userId
}

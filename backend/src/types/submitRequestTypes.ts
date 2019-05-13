export interface CreateSubmitRequest {
  uploadId: string
  taskId: string
  userId: string
}
export function isCreateSubmitRequest(arg: any): arg is CreateSubmitRequest {
  return arg.uploadId && arg.taskId && arg.userId
}

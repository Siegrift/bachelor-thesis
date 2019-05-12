export interface CreateSubmitRequest {
  savedEntryName: string
  taskId: string
  userId: string
}
export function isCreateSubmitRequest(arg: any): arg is CreateSubmitRequest {
  return arg.savedEntryName && arg.taskId
}

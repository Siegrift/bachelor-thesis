export interface EntityByIdQueryParams {
  id: string | string[]
}
export const isEntityByIdQuery = (
  query: any,
): query is EntityByIdQueryParams => {
  return (query as EntityByIdQueryParams).id !== undefined
}

export interface GetByNameQueryParams {
  name?: string
  exact?: boolean
}

export type GetUsersQueryParams = GetByNameQueryParams

export type GetGroupsQueryParams = GetByNameQueryParams

export interface GetUserGroupsQueryParams {
  userId?: string
  groupId?: string
  // user group can be queried by userId and groupId. Default query is disjnuction .
  conjunction?: boolean
}

export interface GetTasksQueryParams extends GetByNameQueryParams {
  groupId?: string
}

export type GetSubmitsQueryParams = GetByNameQueryParams

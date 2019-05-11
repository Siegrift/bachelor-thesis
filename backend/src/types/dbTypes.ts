export interface EntityByIdQueryParams {
  id: string | string[]
}
export const isEntityByIdQuery = (
  query: any,
): query is EntityByIdQueryParams => {
  return (query as EntityByIdQueryParams).id !== undefined
}

export interface GetUsersQueryParams {
  name?: string
  exact?: boolean
}

export interface GetGroupsQueryParams {
  name?: string
  exact?: boolean
}

export interface GetUserGroupsQueryParams {
  userId?: string
  groupId?: string
}

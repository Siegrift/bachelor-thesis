import { basicRequest } from './requestWrapper'
import {
  countUserGroups,
  createUserGroup as createUserGroupFromDb,
  getUserGroup as getUserGroupFromDb,
  getUserGroups as getUserGroupsFromDb,
  removeUserGroup as removeUserGroupInDb
} from '../db/queries/userGroupQueries'

export const createUserGroup = basicRequest(async ({ request, response }) => {
  const { userId, groupId } = request.body

  const userGroup = await createUserGroupFromDb(userId, groupId)
  response.json(userGroup)
})

export const removeUserGroup = basicRequest(async ({ request, response }) => {
  const { userGroupId } = request.params

  const userGroup = await removeUserGroupInDb(userGroupId)
  response.json(userGroup)
})

export const getUserGroups = basicRequest(async ({ response, request }) => {
  const groups = await getUserGroupsFromDb(request.query)
  response.set('X-Total-Count', await countUserGroups())
  response.json(groups)
})

export const getUserGroup = basicRequest(async ({ request, response }) => {
  const { userGroupId } = request.params

  const user = await getUserGroupFromDb(userGroupId)
  response.json(user)
})

export const updateUserGroup = basicRequest(async ({ request, response }) => {
  response.json(request.body)
})

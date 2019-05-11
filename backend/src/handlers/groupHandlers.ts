import { basicRequest } from './requestWrapper'
import {
  countGroups,
  createGroup as createGroupInDb,
  getGroup as getGroupFromDb,
  getGroups as getGroupsFromDb,
  removeGroup as removeGroupFromDb,
  updateGroup as updateGroupInDb
} from '../db/queries/groupQueries'
import { BAD_REQUEST, FORBIDDEN } from '../constants'
import {
  isCreateGroupRequest,
  isUpdateGroupRequest
} from '../types/groupRequestTypes'

export const getGroups = basicRequest(async ({ response, request }) => {
  const groups = await getGroupsFromDb(request.query)
  response.set('X-Total-Count', await countGroups())
  response.json(groups)
})

export const createGroup = basicRequest(async ({ request, response }) => {
  const body = request.body
  if (!isCreateGroupRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const groupName = body.name
  const groups = await getGroupsFromDb({ name: groupName })
  if (groups.length > 0) {
    response.status(FORBIDDEN).send(`Skupina ${groupName} už existuje!`)
  } else {
    const newGroup = await createGroupInDb(groupName)
    response.json(newGroup)
  }
})

export const getGroup = basicRequest(async ({ request, response }) => {
  const { groupId } = request.params

  const group = await getGroupFromDb(groupId)
  response.json(group)
})

export const removeGroup = basicRequest(async ({ request, response }) => {
  const { groupId } = request.params

  const group = await removeGroupFromDb(groupId)
  response.json(group)
})

export const updateGroup = basicRequest(async ({ response, request }) => {
  const { groupId } = request.params
  const updateGroupBody = request.body
  if (!isUpdateGroupRequest(updateGroupBody)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const updatedGroup = await updateGroupInDb(groupId, updateGroupBody)
  response.json(updatedGroup)
})

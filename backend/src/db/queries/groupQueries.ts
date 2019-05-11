import knex from '../knex'
import uuid from 'uuid/v4'
import { UpdateGroupRequest } from '../../types/groupRequestTypes'
import {
  EntityByIdQueryParams,
  GetGroupsQueryParams,
  isEntityByIdQuery
} from '../../types/dbTypes'
import {
  applyDefaultFilterQueryParams,
  countDbRows,
  formatFilterToSqlTarget
} from './queryUtils'

export const countGroups = () => countDbRows('group')
export const getGroups = async (
  params: GetGroupsQueryParams | EntityByIdQueryParams,
) => {
  if (isEntityByIdQuery(params)) {
    // get entities request should always return an array of results
    return [await getGroup(params.id)]
  }

  const {
    name,
    _sort,
    _end,
    _order,
    _start,
    exact,
  } = applyDefaultFilterQueryParams(params)

  return knex('group')
    .select(['group.name', 'group.id'])
    .modify((query: any) => {
      if (name) {
        query.where('name', 'like', formatFilterToSqlTarget(name, exact))
      }
    })
    .orderBy(_sort, _order)
    .limit(_end - _start)
    .offset(_start)
}

export const createGroup = (groupName: string) => {
  return knex('group')
    .insert({
      id: uuid(),
      name: groupName,
    })
    .returning('*')
    .spread((row) => row)
}

export const getGroup = (groupId: string) => {
  return knex('group')
    .select('*')
    .where({ id: groupId })
    .first()
}

export const removeGroup = async (groupId: string) => {
  return knex('group')
    .where({ id: groupId })
    .delete()
    .returning('*')
    .spread((row) => row)
}

export const updateGroup = (
  groupId: string,
  updateGroupBody: UpdateGroupRequest,
) => {
  return knex('group')
    .where({ id: groupId })
    .update({ name: updateGroupBody.name })
    .returning('*')
    .spread((row) => row)
}

import knex from '../knex'
import uuid from 'uuid/v4'
import { GetUserGroupsQueryParams } from '../../types/dbTypes'
import {
  applyDefaultFilterQueryParams,
  countDbRows,
  formatFilterToSqlTarget
} from './queryUtils'

export const createUserGroup = (userId: string, groupId: string) => {
  return knex('user_group')
    .insert({ id: uuid(), user_id: userId, group_id: groupId })
    .returning('*')
    .spread((row) => row)
}

export const removeUserGroup = (userGroupId: string) => {
  return knex('user_group')
    .where({ id: userGroupId })
    .delete()
    .returning('*')
    .spread((row) => row)
}

export const getUserGroup = (userGroupId: string) => {
  return knex('user_group')
    .select('*')
    .where({ id: userGroupId })
    .first()
}

export const countUserGroups = () => countDbRows('user_group')
export const getUserGroups = async (params: GetUserGroupsQueryParams) => {
  const {
    groupId,
    userId,
    _sort,
    _end,
    _order,
    _start,
    conjunction,
    exact,
  } = applyDefaultFilterQueryParams(params)

  return knex('user_group')
    .modify((query: any) => {
      if (groupId) {
        query.where(
          knex.raw('group_id::text'),
          'like',
          formatFilterToSqlTarget(groupId, exact),
        )
      }
      if (userId) {
        if (conjunction) {
          query.andWhere(
            knex.raw('user_id::text'),
            'like',
            formatFilterToSqlTarget(userId, exact),
          )
        } else {
          query.orWhere(
            knex.raw('user_id::text'),
            'like',
            formatFilterToSqlTarget(userId, exact),
          )
        }
      }
    })
    .orderBy(_sort, _order)
    .limit(_end - _start)
    .offset(_start)
}

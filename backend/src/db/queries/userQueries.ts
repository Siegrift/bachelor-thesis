import knex from '../knex'
import uuid from 'uuid/v4'
import { pick } from 'lodash'
import {
  LoginUserRequest,
  UpdateUserRequest
} from '../../types/userRequestTypes'
import {
  EntityByIdQueryParams,
  GetUsersQueryParams,
  isEntityByIdQuery
} from '../../types/dbTypes'
import {
  applyDefaultFilterQueryParams,
  countDbRows,
  formatFilterToSqlTarget
} from './queryUtils'
import { Transaction } from 'knex'
import { createUserGroup } from './userGroupQueries'

export const createUser = (user: LoginUserRequest) => {
  return knex('user')
    .insert({
      ...pick(user, ['name', 'password']),
      id: uuid(),
      is_admin: false,
    })
    .returning('*')
    .spread((row) => row)
}

export const countUsers = () => countDbRows('user')
export const getUsers = async (
  params: GetUsersQueryParams | EntityByIdQueryParams,
) => {
  if (isEntityByIdQuery(params)) {
    // get entities request should always return an array of results
    return [await getUser(params.id)]
  }

  const {
    name,
    _sort,
    _end,
    _order,
    _start,
    exact,
  } = applyDefaultFilterQueryParams(params)
  return knex('user')
    .leftJoin('user_group', 'user.id', 'user_group.user_id')
    .select([
      'user.name',
      'user.id',
      'user.is_admin',
      // https://stackoverflow.com/questions/31108946/postgres-returns-null-instead-of-for-array-agg-of-join-table
      knex.raw('array_remove(array_agg(user_group.group_id), null) as groups'),
    ])
    .groupBy('user.id')
    .modify((query: any) => {
      if (name) {
        query.where('name', 'like', formatFilterToSqlTarget(name, exact))
      }
    })
    .orderBy(_sort, _order)
    .limit(_end - _start)
    .offset(_start)
}

export const updateUser = async (
  userId: string,
  updateUserBody: UpdateUserRequest,
) => {
  // remove all previous user-group connections and then create new ones
  return knex.transaction(async (tx: Transaction) => {
    await knex('user_group')
      .transacting(tx)
      .where({ user_id: userId })
      .delete()

    const newUserData = { name: updateUserBody.name } as any
    if (updateUserBody.password) newUserData.password = updateUserBody.password
    await knex('user')
      .transacting(tx)
      .where({ id: userId })
      .update(newUserData)

    await Promise.all(
      updateUserBody.groups.map((groupId: string) =>
        createUserGroup(userId, groupId),
      ),
    )

    return getUser(userId)
  })
}

export const getUser = (userId: string) => {
  return knex('user')
    .leftJoin('user_group', 'user.id', 'user_group.user_id')
    .select([
      'user.name',
      'user.id',
      'user.is_admin',
      // https://stackoverflow.com/questions/31108946/postgres-returns-null-instead-of-for-array-agg-of-join-table
      knex.raw('array_remove(array_agg(user_group.group_id), null) as groups'),
    ])
    .where({ ['user.id']: userId })
    .groupBy('user.id')
    .first()
}

export const removeUser = async (userId: string) => {
  return knex('user')
    .where({ id: userId })
    .delete()
    .returning('*')
    .spread((row) => row)
}

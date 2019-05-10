import { Transaction } from 'knex'
import knex from './knex'
import uuid from 'uuid/v4'
import { pick } from 'lodash'

// NOTE: result from DB query is always an array (but often containing only 1 element).
// If you need to flatten the SELECT query result use "knex.first()". For UPDATE, DELETE query
// use "knex.spread((row) => row)".

export const sampleInsertToTestDb = () => {
  return knex('test')
    .insert({ test_field: 'test' })
    .returning('*')
    .spread((row) => row)
}

export interface User {
  name: string
  password: string
  id: string
  is_admin: boolean
}

export const getUserByName = async (name: string): Promise<User> => {
  // there can be at most 1 user with same name
  return knex('user')
    .where({ name })
    .first()
}

interface CreateUser {
  name: string
  password: string
}

export const createUser = (user: CreateUser) => {
  return knex('user')
    .insert({
      ...pick(user, ['name', 'password']),
      id: uuid(),
      is_admin: false,
    } as User)
    .returning('*')
    .spread((row) => row)
}

export const getUsers = async () => {
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
}

export const getGroups = async () => {
  return knex('group').select(['group.name', 'group.id'])
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

export const getGroupByName = async (groupName: string) => {
  // there can be at most 1 group with same name
  return knex('group')
    .where({ name: groupName })
    .first()
}

// TODO: the type of the body is not any. Need to move request types to separate file
// so that we can use the types in both requestHandlets.ts and this file.
export const updateUser = async (userId: string, updateUserBody: any) => {
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

export const getUserGroups = () => {
  return knex('user_group')
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

export const updateGroup = (groupId: string, updateGroupBody: any) => {
  return knex('group')
    .where({ id: groupId })
    .update({ name: updateGroupBody.name })
    .returning('*')
    .spread((row) => row)
}

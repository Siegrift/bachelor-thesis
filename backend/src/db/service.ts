import db from './knex'
import uuid from 'uuid/v4'

export const sampleInsertToTestDb = () => {
  return db('test')
    .insert({ testField: 'test' })
    .returning('*')
}

export interface User {
  name: string
  password: string
  id: string
  isAdmin: boolean
}

export const getUserByName = async (name: string): Promise<User> => {
  const user = (await db('users').where({ name })) as any[]
  // there can be at most 1 user with same name
  return user[0]
}

interface CreateUser {
  name: string
  password: string
}

export const createUser = (user: CreateUser) => {
  return db('users')
    .insert({ ...user, id: uuid(), isAdmin: false } as User)
    .returning('*')
}

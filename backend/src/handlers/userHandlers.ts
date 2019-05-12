import { basicRequest } from './requestWrapper'
import {
  countUsers,
  createUser as createUserFromDb,
  getUser as getUserFromDb,
  getUsers as getUsersFromDb,
  removeUser as removeUserFromDb,
  updateUser as updateUserInDb
} from '../db/queries/userQueries'
import { BAD_REQUEST, FORBIDDEN, OK } from '../constants'
import {
  isCreateUserRequest,
  isLoginUserRequest,
  isUpdateUserRequest
} from '../types/userRequestTypes'
import { pick } from 'lodash'

// TODO: define entities and remove any
const prepareUserDataToReturn = (user: any) =>
  pick(user, ['id', 'name', 'is_admin'])

export const createUser = basicRequest(async ({ request, response }) => {
  const body = request.body
  if (!isCreateUserRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const users = await getUsersFromDb({ name: body.name, exact: true })
  if (body.password !== body.repeatPassword) {
    response.status(FORBIDDEN).send(`Heslá sa nezhodujú!`)
  } else if (users.length > 0) {
    response.status(FORBIDDEN).send(`Používateľ ${body.name} už existuje!`)
  } else {
    const createdUser = await createUserFromDb(body)
    response.json(prepareUserDataToReturn(createdUser))
  }
})

export const loginUser = basicRequest(async ({ request, response }) => {
  const body = request.body
  if (!isLoginUserRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const users = await getUsersFromDb({ name: body.name, exact: true })

  if (users.length === 0 || users[0].password !== body.password) {
    response.status(FORBIDDEN).send(`Nesprávne meno alebo heslo!`)
  } else {
    response.status(OK).send(prepareUserDataToReturn(users[0]))
  }
})

export const getUsers = basicRequest(async ({ response, request }) => {
  const users = await getUsersFromDb(request.query)
  response.set('X-Total-Count', await countUsers())
  response.json(users.map(prepareUserDataToReturn))
})

export const updateUser = basicRequest(async ({ response, request }) => {
  const userId = request.params.userId
  const updateUserBody = request.body
  if (!isUpdateUserRequest(updateUserBody)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  await updateUserInDb(userId, updateUserBody)
  // we can't return the updated user data, because it will break react admin
  // optimistic rendering
  response.json(updateUserBody)
})

export const getUser = basicRequest(async ({ request, response }) => {
  const { userId } = request.params

  const user = await getUserFromDb(userId)
  response.json(user)
})

export const removeUser = basicRequest(async ({ request, response }) => {
  const { userId } = request.params

  const user = await removeUserFromDb(userId)
  response.json(user)
})

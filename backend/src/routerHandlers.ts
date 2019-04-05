import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { createUser, getUserByName, sampleInsertToTestDb } from './db/service'
import { listFiles, readFile } from './utils'

const FORBIDDEN = 403
const OK = 200
const BAD_REQUEST = 400

export const testBackendConnection = basicRequest(async ({ response }) => {
  response.json('Backend working :)')
})

interface LoginUserRequest {
  name: string
  password: string
}
function isLoginUserRequest(arg: any): arg is LoginUserRequest {
  return arg.name && arg.password
}

export const testDbConnection = basicRequest(async ({ response }) => {
  const dbEntry = await sampleInsertToTestDb()
  response.json(`Database running! Inserted ${JSON.stringify(dbEntry)}`)
})

type RegisterUserRequest = LoginUserRequest
function isRegisterUserRequest(arg: any): arg is RegisterUserRequest {
  return arg.name && arg.password
}

export const registerUser = basicRequest(async ({ request, response }) => {
  const userRequest = request.body
  if (!isRegisterUserRequest(userRequest)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const user = await getUserByName(userRequest.name)
  if (user) {
    response
      .status(FORBIDDEN)
      .send(`Používateľ ${userRequest.name} už existuje!`)
  } else {
    const createdUser = await createUser(userRequest)
    response.json(createdUser)
  }
})

export const loginUser = basicRequest(async ({ request, response }) => {
  const userRequest = request.body
  if (!isLoginUserRequest(userRequest)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const user = await getUserByName(userRequest.name)
  if (!user || user.password !== userRequest.password) {
    response.status(FORBIDDEN).send(`Nesprávne meno alebo heslo!`)
  } else {
    response.status(OK).send(user)
  }
})

export const listMockedFiles = basicRequest(async ({ response }) => {
  const PUBLIC_FILES_DIR = join(__dirname, '../mocked-data/public')
  response.json(await listFiles(PUBLIC_FILES_DIR))
})

export const getMockedFile = basicRequest(async ({ request, response }) => {
  const file = request.params.file
  const filePath = join(__dirname, '../mocked-data/public', file)

  response.send(await readFile(filePath))
})

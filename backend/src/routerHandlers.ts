import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { createUser, getUserByName, sampleInsertToTestDb } from './db/service'
import { ensureFile, readFile, writeFile } from 'fs-extra'
import recursivelyLstFiles from 'recursive-readdir'
import { PROBLEMS_PATH, SAVE_ENTRY_AS_KEY, UPLOADS_PATH } from './constants'
import { forEach, omit } from 'lodash'
import { runInSandBox } from './sandbox/sandbox'

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
  const PUBLIC_FILES_DIR = join(PROBLEMS_PATH, 'mocked-data/public')
  const files = await recursivelyLstFiles(PUBLIC_FILES_DIR)
  response.json(files.map((file) => file.split('public/').pop()))
})

export const getMockedFile = basicRequest(async ({ request, response }) => {
  const file = request.params.file + request.params[0]
  const filePath = join(PROBLEMS_PATH, 'mocked-data/public', file)

  response.send(await readFile(filePath))
})

export const saveFiles = basicRequest(async ({ request, response }) => {
  const saveEntryName = request.body[SAVE_ENTRY_AS_KEY]
  const filesToSave = omit(request.body, [SAVE_ENTRY_AS_KEY])

  forEach(filesToSave, async (content: string, name: string) => {
    const SAVE_PATH = join(UPLOADS_PATH, saveEntryName, name)
    await ensureFile(SAVE_PATH)
    // we just fire the save actions, no need to wait as we don't handle errors anyway
    await writeFile(SAVE_PATH, content)
  })

  response.status(OK).send()
})

export const runSavedCode = basicRequest(async ({ request, response }) => {
  const folder = decodeURIComponent(request.params.folder)
  // TODO: this only works for one problem folder
  const compileScriptPath = join(
    PROBLEMS_PATH,
    'mocked-data/hidden/run_script.json',
  )

  try {
    const compileScript = JSON.parse(
      (await readFile(compileScriptPath)).toString(),
    )

    const sandboxOutput = await runInSandBox(folder, compileScript)

    response.status(OK).send(sandboxOutput)
  } catch (err) {
    response.status(BAD_REQUEST).send(err)
    return
  }
})

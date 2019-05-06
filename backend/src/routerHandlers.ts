import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { createUser, getUserByName, sampleInsertToTestDb } from './db/service'
import { ensureFile, readdir, readFile, writeFile } from 'fs-extra'
import recursivelyListFiles from 'recursive-readdir'
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
  const files = await recursivelyListFiles(PUBLIC_FILES_DIR)
  response.json(files.map((file) => file.split('public/').pop()))
})

export const getMockedFile = basicRequest(async ({ request, response }) => {
  const file = decodeURIComponent(request.params.file)
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
  const customInput = request.body
  // TODO: this only works for one problem folder
  const compileScriptPath = join(
    PROBLEMS_PATH,
    'mocked-data/hidden/run_script.json',
  )

  try {
    const compileScript = JSON.parse(
      (await readFile(compileScriptPath)).toString(),
    )

    const sandboxOutput = await runInSandBox(folder, {
      ...compileScript,
      customInput,
    })

    response.status(OK).send(sandboxOutput)
  } catch (err) {
    response.status(BAD_REQUEST).send(err)
    return
  }
})

export const listUploads = basicRequest(async ({ response }) => {
  const files = await readdir(UPLOADS_PATH)
  response.json(files)
})

export const getUploadedFile = basicRequest(async ({ request, response }) => {
  const upload = request.params.upload
  const file = decodeURIComponent(request.params.file)

  const filePath = join(UPLOADS_PATH, upload, file)

  response.send(await readFile(filePath))
})

export const listUploadedFiles = basicRequest(async ({ request, response }) => {
  const upload = request.params.upload
  const uploadsPath = join(UPLOADS_PATH, upload)

  const files = await recursivelyListFiles(uploadsPath)
  response.json(files.map((file) => file.split(`${upload}/`).pop()))
})

const filenameSort = (f1: string, f2: string) => {
  const name1 = f1.split('.')[0]
  const name2 = f2.split('.')[0]
  return parseInt(name1, 10) - parseInt(name2, 10)
}

export const submit = basicRequest(async ({ request, response }) => {
  const folder = decodeURIComponent(request.params.folder)
  // TODO: this only works for one problem folder
  const compileScriptPath = join(
    PROBLEMS_PATH,
    'mocked-data/hidden/run_script.json',
  )
  const inputFiles = (await recursivelyListFiles(
    // TODO: this only works for one problem folder
    join(PROBLEMS_PATH, 'mocked-data/hidden'),
  ))
    .filter((file) => file.endsWith('.in'))
    .map((file) => file.split('mocked-data/').pop() as string)
    .sort(filenameSort)
  const outputFiles = (await recursivelyListFiles(
    // TODO: this only works for one problem folder
    join(PROBLEMS_PATH, 'mocked-data/hidden'),
  ))
    .filter((file) => file.endsWith('.out'))
    .sort(filenameSort)

  try {
    const compileScript = JSON.parse(
      (await readFile(compileScriptPath)).toString(),
    )

    for (let i = 0; i < inputFiles.length; i++) {
      const sandboxOutput = await runInSandBox(folder, {
        ...compileScript,
        inputFile: inputFiles[i],
      })
      const problemOutput = (await readFile(outputFiles[i])).toString()

      if (sandboxOutput.executionTime === -1) {
        response.status(OK).send({ input: i, result: 'TLE' })
        return
      } else if (sandboxOutput.error) {
        response.status(OK).send({ input: i, result: 'RTE' })
        return
      } else if (sandboxOutput.data !== problemOutput) {
        response.status(OK).send({ input: i, result: 'WA' })
        return
      }
    }

    response.status(OK).send({ input: inputFiles.length - 1, result: 'OK' })
  } catch (err) {
    response.status(OK).send(err)
    return
  }
})

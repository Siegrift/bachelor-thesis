import { basicRequest } from './requestWrapper'
import {
  countSubmits,
  createSubmit as createSubmitInDb,
  getSubmit as getSubmitFromDb,
  getSubmits as getSubmitsFromDb
} from '../db/queries/submitQueries'
import recursivelyListFiles from 'recursive-readdir'
import { join } from 'path'
import { readFile } from 'fs-extra'
import { BAD_REQUEST, OK, TASKS_PATH } from '../constants'
import { runInSandBox } from '../sandbox/sandbox'
import { isCreateSubmitRequest } from '../types/submitRequestTypes'

const filenameSort = (f1: string, f2: string) => {
  const name1 = f1.split('.')[0]
  const name2 = f2.split('.')[0]
  return parseInt(name1, 10) - parseInt(name2, 10)
}

export const getSubmits = basicRequest(async ({ response, request }) => {
  const submits = await getSubmitsFromDb(request.query)
  response.set('X-Total-Count', await countSubmits())
  response.json(submits)
})

export const createSubmit = basicRequest(async ({ request, response }) => {
  const body = request.body
  if (!isCreateSubmitRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const { uploadId, taskId } = body
  const compileScriptPath = join(TASKS_PATH, taskId, '/hidden/run_script.json')
  const inputFiles = (await recursivelyListFiles(
    join(TASKS_PATH, taskId, 'hidden'),
  ))
    .filter((file) => file.endsWith('.in'))
    .map((file) => file.split(`${taskId}/`).pop() as string)
    .sort(filenameSort)
  const outputFiles = (await recursivelyListFiles(
    join(TASKS_PATH, taskId, 'hidden'),
  ))
    .filter((file) => file.endsWith('.out'))
    .sort(filenameSort)

  try {
    const compileScript = JSON.parse(
      (await readFile(compileScriptPath)).toString(),
    )

    let result = 'OK'
    let totalPasedInputs = 0
    for (let i = 0; i < inputFiles.length; i++) {
      const sandboxOutput = await runInSandBox(uploadId, taskId, {
        ...compileScript,
        inputFile: inputFiles[i],
      })
      const taskOutput = (await readFile(outputFiles[i])).toString()

      if (sandboxOutput.executionTime === -1) {
        result = 'TLE'
        break
      } else if (sandboxOutput.error) {
        result = 'RTE'
        break
      } else if (sandboxOutput.data !== taskOutput) {
        result = 'WA'
        break
      } else {
        totalPasedInputs++
      }
    }

    await createSubmitInDb(body, result)
    await response.status(OK).send({ input: totalPasedInputs, result })
  } catch (err) {
    await createSubmitInDb(body, 'SERVER_ERROR')
    response.status(OK).send(err)
    return
  }
})

export const getSubmit = basicRequest(async ({ request, response }) => {
  const { submitId } = request.params

  const submit = await getSubmitFromDb(submitId)
  response.json(submit)
})

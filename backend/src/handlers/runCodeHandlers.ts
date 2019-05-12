import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { readFile } from 'fs-extra'
import recursivelyListFiles from 'recursive-readdir'
import { BAD_REQUEST, OK, TASKS_PATH } from '../constants'
import { runInSandBox } from '../sandbox/sandbox'

export const runSavedCode = basicRequest(async ({ request, response }) => {
  // TODO: why is it not json at this point???
  const { input, savedEntryName, taskId } = JSON.parse(request.body)
  const compileScriptPath = join(
    TASKS_PATH,
    `${taskId}/hidden/run_script.json`,
  )

  try {
    const compileScript = JSON.parse(
      (await readFile(compileScriptPath)).toString(),
    )

    const sandboxOutput = await runInSandBox(savedEntryName, taskId, {
      ...compileScript,
      customInput: input,
    })

    response.status(OK).send(sandboxOutput)
  } catch (err) {
    response.status(BAD_REQUEST).send(err)
    return
  }
})

const filenameSort = (f1: string, f2: string) => {
  const name1 = f1.split('.')[0]
  const name2 = f2.split('.')[0]
  return parseInt(name1, 10) - parseInt(name2, 10)
}

export const submit = basicRequest(async ({ request, response }) => {
  const { savedEntryName, taskId } = JSON.parse(request.body)
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

    for (let i = 0; i < inputFiles.length; i++) {
      const sandboxOutput = await runInSandBox(savedEntryName, taskId, {
        ...compileScript,
        inputFile: inputFiles[i],
      })
      const taskOutput = (await readFile(outputFiles[i])).toString()

      if (sandboxOutput.executionTime === -1) {
        response.status(OK).send({ input: i, result: 'TLE' })
        return
      } else if (sandboxOutput.error) {
        response.status(OK).send({ input: i, result: 'RTE' })
        return
      } else if (sandboxOutput.data !== taskOutput) {
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

import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { readFile } from 'fs-extra'
import recursivelyListFiles from 'recursive-readdir'
import { BAD_REQUEST, OK, PROBLEMS_PATH } from '../constants'
import { runInSandBox } from '../sandbox/sandbox'

export const runSavedCode = basicRequest(async ({ request, response }) => {
  const folder = decodeURIComponent(request.params.folder)
  const customInput = request.body
  // TODO: this only works for one task folder
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

const filenameSort = (f1: string, f2: string) => {
  const name1 = f1.split('.')[0]
  const name2 = f2.split('.')[0]
  return parseInt(name1, 10) - parseInt(name2, 10)
}

export const submit = basicRequest(async ({ request, response }) => {
  const folder = decodeURIComponent(request.params.folder)
  // TODO: this only works for one task folder
  const compileScriptPath = join(
    PROBLEMS_PATH,
    'mocked-data/hidden/run_script.json',
  )
  const inputFiles = (await recursivelyListFiles(
    // TODO: this only works for one task folder
    join(PROBLEMS_PATH, 'mocked-data/hidden'),
  ))
    .filter((file) => file.endsWith('.in'))
    .map((file) => file.split('mocked-data/').pop() as string)
    .sort(filenameSort)
  const outputFiles = (await recursivelyListFiles(
    // TODO: this only works for one task folder
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

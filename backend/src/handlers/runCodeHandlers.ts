import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { readFile } from 'fs-extra'
import { BAD_REQUEST, OK, TASKS_PATH } from '../constants'
import { runInSandBox } from '../sandbox/sandbox'

export const runSavedCode = basicRequest(async ({ request, response }) => {
  const { input, uploadId, taskId } = request.body
  const compileScriptPath = join(
    TASKS_PATH,
    `${taskId}/hidden/run_script.json`,
  )

  try {
    const compileScript = JSON.parse(
      (await readFile(compileScriptPath)).toString(),
    )

    const sandboxOutput = await runInSandBox(uploadId, taskId, {
      ...compileScript,
      customInput: input,
    })

    response.status(OK).send(sandboxOutput)
  } catch (err) {
    response.status(BAD_REQUEST).send(err)
    return
  }
})

import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { readFile } from 'fs-extra'
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

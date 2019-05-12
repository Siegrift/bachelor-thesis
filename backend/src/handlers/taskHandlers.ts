import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { ensureFile, readFile, remove, writeFile } from 'fs-extra'
import recursivelyListFiles from 'recursive-readdir'
import { BAD_REQUEST, FORBIDDEN, PROBLEMS_PATH } from '../constants'
import {
  createTask as createTaskInDb,
  getTask as getTaskFromDb,
  getTasks as getTasksFromDb,
  removeTask as removeTaskFromDb,
  updateTask as updateTaskInDb
} from '../db/queries/taskQueries'
import {
  isCreateTaskRequest,
  isUpdateTaskRequest,
  TaskFile
} from '../types/taskRequestTypes'

const storeTaskFiles = (taskId: string, files: TaskFile[]) => {
  const pathPrefix = join(PROBLEMS_PATH, taskId)
  return Promise.all(
    files.map(async (file) => {
      const filename = join(pathPrefix, file.name)
      await ensureFile(filename)
      return writeFile(filename, file.content || '')
    }),
  )
}

export const getTasks = basicRequest(async ({ response, request }) => {
  const tasks = await getTasksFromDb(request.query)
  response.set('X-Total-Count', tasks.length.toString())
  response.json(tasks)
})

export const getTask = basicRequest(async ({ request, response }) => {
  const { taskId } = request.params

  const task = await getTaskFromDb(taskId)
  const rawFiles = await recursivelyListFiles(join(PROBLEMS_PATH, taskId))
  const files = await Promise.all(
    rawFiles.map(async (file) => ({
      name: file.split(`${taskId}/`).pop(),
      content: (await readFile(file)).toString(),
    })),
  )

  response.json({ ...task, files })
})

export const updateTask = basicRequest(async ({ response, request }) => {
  const { taskId } = request.params
  const body = request.body

  if (!isUpdateTaskRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const task = await getTaskFromDb(taskId)
  if (!task) {
    response.status(BAD_REQUEST).send(`Zadanie s id ${taskId} neexistuje!`)
    return
  }

  // remove all files and recreate them because file name could be modified
  await remove(join(PROBLEMS_PATH, taskId))
  await updateTaskInDb(taskId, body)
  await storeTaskFiles(taskId, body.files)

  // we can't return the updated user data, because it will break react admin
  // optimistic rendering
  response.json(body)
})

export const createTask = basicRequest(async ({ request, response }) => {
  const body = request.body
  if (!isCreateTaskRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const tasks = await getTasksFromDb({ name: body.name, exact: true })
  if (tasks.length > 0) {
    response.status(FORBIDDEN).send(`Zadanie s názvom ${name} už existuje!`)
    return
  }

  // TODO: create types for db entities and remove cast to any
  const task = (await createTaskInDb(body)) as any
  await storeTaskFiles(task.id, body.files)

  response.json(task)
})

export const removeTask = basicRequest(async ({ request, response }) => {
  const { taskId } = request.params

  const task = await removeTaskFromDb(taskId)
  await remove(join(PROBLEMS_PATH, taskId))
  response.json(task)
})

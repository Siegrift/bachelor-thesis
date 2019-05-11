import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { ensureFile, readFile, remove, writeFile } from 'fs-extra'
import recursivelyListFiles from 'recursive-readdir'
import { BAD_REQUEST, FORBIDDEN, PROBLEMS_PATH } from '../constants'
import {
  createProblem as createProblemInDb,
  getProblem as getProblemFromDb,
  getProblems as getProblemsFromDb,
  removeProblem as removeProblemFromDb,
  updateProblem as updateProblemInDb
} from '../db/queries/problemQueries'
import {
  isCreateProblemRequest,
  isUpdateProblemRequest,
  ProblemFile
} from '../types/problemRequestTypes'

const storeProblemFiles = (problemId: string, files: ProblemFile[]) => {
  const pathPrefix = join(PROBLEMS_PATH, problemId)
  return Promise.all(
    files.map(async (file) => {
      const filename = join(pathPrefix, file.name)
      await ensureFile(filename)
      return writeFile(filename, file.content || '')
    }),
  )
}

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

export const getProblems = basicRequest(async ({ response, request }) => {
  const problems = await getProblemsFromDb(request.query)
  response.set('X-Total-Count', problems.length.toString())
  response.json(problems)
})

export const getProblem = basicRequest(async ({ request, response }) => {
  const { problemId } = request.params

  const problem = await getProblemFromDb(problemId)
  const rawFiles = await recursivelyListFiles(join(PROBLEMS_PATH, problemId))
  const files = await Promise.all(
    rawFiles.map(async (file) => ({
      name: file.split(`${problemId}/`).pop(),
      content: (await readFile(file)).toString(),
    })),
  )

  response.json({ ...problem, files })
})

export const updateProblem = basicRequest(async ({ response, request }) => {
  const { problemId } = request.params
  const body = request.body

  if (!isUpdateProblemRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const problem = await getProblemFromDb(problemId)
  if (!problem) {
    response.status(BAD_REQUEST).send(`Zadanie s id ${problemId} neexistuje!`)
    return
  }

  // remove all files and recreate them because file name could be modified
  await remove(join(PROBLEMS_PATH, problemId))
  await updateProblemInDb(problemId, body)
  await storeProblemFiles(problemId, body.files)

  // we can't return the updated user data, because it will break react admin
  // optimistic rendering
  response.json(body)
})

export const createProblem = basicRequest(async ({ request, response }) => {
  const body = request.body
  if (!isCreateProblemRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  const problems = await getProblemsFromDb({ name: body.name, exact: true })
  if (problems.length > 0) {
    response.status(FORBIDDEN).send(`Zadanie s názvom ${name} už existuje!`)
    return
  }

  // TODO: create types for db entities and remove cast to any
  const problem = (await createProblemInDb(body)) as any
  await storeProblemFiles(problem.id, body.files)

  response.json(problem)
})

export const removeProblem = basicRequest(async ({ request, response }) => {
  const { problemId } = request.params

  const problem = await removeProblemFromDb(problemId)
  await remove(join(PROBLEMS_PATH, problemId))
  response.json(problem)
})

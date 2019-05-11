import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { readFile } from 'fs-extra'
import recursivelyListFiles from 'recursive-readdir'
import { PROBLEMS_PATH } from '../constants'

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

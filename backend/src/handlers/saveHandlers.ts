import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { ensureFile, readdir, readFile, writeFile } from 'fs-extra'
import recursivelyListFiles from 'recursive-readdir'
import { OK, SAVE_ENTRY_AS_KEY, UPLOADS_PATH } from '../constants'
import { map, omit } from 'lodash'

export const saveFiles = basicRequest(async ({ request, response }) => {
  const saveEntryName = request.body[SAVE_ENTRY_AS_KEY]
  const filesToSave = omit(request.body, [SAVE_ENTRY_AS_KEY])

  await Promise.all(
    map(filesToSave, async (content: string, name: string) => {
      const SAVE_PATH = join(UPLOADS_PATH, saveEntryName, name)
      await ensureFile(SAVE_PATH)
      await writeFile(SAVE_PATH, content)
    }),
  )

  response.status(OK).send()
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

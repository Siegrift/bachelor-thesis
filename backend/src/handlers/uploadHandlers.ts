import { join } from 'path'
import { basicRequest } from './requestWrapper'
import { ensureFile, readdir, readFile, writeFile } from 'fs-extra'
import recursivelyListFiles from 'recursive-readdir'
import { BAD_REQUEST, OK, UPLOADS_PATH } from '../constants'
import { map } from 'lodash'
import {
  countUploads,
  createUpload as createUploadInDb,
  getUpload as getUploadFromDb,
  getUploads as getUploadsFromDb
} from '../db/queries/uploadQueries'
import { isCreateUploadRequest } from '../types/uploadRequestTypes'

export const createUpload = basicRequest(async ({ request, response }) => {
  const body = request.body
  if (!isCreateUploadRequest(body)) {
    response.status(BAD_REQUEST).send(`Frontend poslal nesprávne dáta!`)
    return
  }

  // TODO: create entity types
  const upload = (await createUploadInDb(body)) as any
  await Promise.all(
    map(body.files, async (content: string, name: string) => {
      const SAVE_PATH = join(UPLOADS_PATH, upload.id, name)
      await ensureFile(SAVE_PATH)
      return writeFile(SAVE_PATH, content)
    }),
  )

  response.status(OK).json(upload)
})

export const getUploads = basicRequest(async ({ request, response }) => {
  const groups = await getUploadsFromDb(request.query)
  response.set('X-Total-Count', await countUploads())
  response.json(groups)

  const files = await readdir(UPLOADS_PATH)
  response.json(files)
})

export const getUpload = basicRequest(async ({ request, response }) => {
  const { uploadId } = request.params
  const uploadsPath = join(UPLOADS_PATH, uploadId)

  const upload = await getUploadFromDb(uploadId)
  const rawFiles = await recursivelyListFiles(uploadsPath)
  const files = await Promise.all(
    rawFiles.map(async (file) => ({
      name: file.split(`${uploadId}/`).pop(),
      content: (await readFile(file)).toString(),
    })),
  )

  response.json({ ...upload, files })
})

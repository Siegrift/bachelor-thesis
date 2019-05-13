import knex from '../knex'
import uuid from 'uuid/v4'
import {
  EntityByIdQueryParams,
  GetUploadsQueryParams,
  isEntityByIdQuery
} from '../../types/dbTypes'
import {
  applyDefaultFilterQueryParams,
  countDbRows,
  formatFilterToSqlTarget
} from './queryUtils'
import { CreateUploadRequest } from '../../types/uploadRequestTypes'
import { SAVE_ENTRY_AS_KEY } from '../../constants'

export const countUploads = () => countDbRows('upload')
export const getUploads = async (
  params: GetUploadsQueryParams | EntityByIdQueryParams,
) => {
  if (isEntityByIdQuery(params)) {
    // get entities request should always return an array of results
    if (typeof params.id === 'string') return [await getUpload(params.id)]
    else {
      return knex('upload')
        .select('*')
        .modify((query: any) => {
          (params.id as string[]).forEach((id) => {
            query.orWhere({ id })
          })
        })
    }
  }

  const {
    name,
    _sort,
    _end,
    _order,
    _start,
    exact,
    userId,
    conjunction,
  } = applyDefaultFilterQueryParams(params)

  return knex('upload')
    .select('*')
    .modify((query: any) => {
      if (name) {
        query.where('name', 'like', formatFilterToSqlTarget(name, exact))
      }
      if (userId) {
        if (conjunction) {
          query.andWhere(
            knex.raw('user_id::text'),
            'like',
            formatFilterToSqlTarget(userId, exact),
          )
        } else {
          query.orWhere(
            knex.raw('user_id::text'),
            'like',
            formatFilterToSqlTarget(userId, exact),
          )
        }
      }
    })
    .orderBy(_sort, _order)
    .limit(_end - _start)
    .offset(_start)
}

export const getUpload = (uploadId: string) => {
  return knex('upload')
    .select('*')
    .where({ id: uploadId })
    .first()
}

export const createUpload = (body: CreateUploadRequest) => {
  return knex('upload')
    .insert({
      id: uuid(),
      task_id: body.taskId,
      user_id: body.userId,
      name: body[SAVE_ENTRY_AS_KEY],
      created_at: body.createdAt,
      is_autosave: body.isAutosave,
    })
    .returning('*')
    .spread((row) => row)
}

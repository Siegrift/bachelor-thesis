import knex from '../knex'
import { GetSubmitsQueryParams } from '../../types/dbTypes'
import { applyDefaultFilterQueryParams, countDbRows } from './queryUtils'
import { CreateSubmitRequest } from '../../types/submitRequestTypes'
import uuid from 'uuid/v4'

export const countSubmits = () => countDbRows('submit')
export const getSubmits = async (params: GetSubmitsQueryParams) => {
  const { _sort, _end, _order, _start } = applyDefaultFilterQueryParams(params)

  return knex('submit')
    .leftJoin('upload', 'upload.id', 'submit.upload_id')
    .select(['submit.*', 'upload.created_at'])
    .orderBy(_sort, _order)
    .limit(_end - _start)
    .offset(_start)
}

// TODO: result can be only OK, WA, RTE and CE. Create a type for it
export const createSubmit = (body: CreateSubmitRequest, result: string) => {
  return knex('submit')
    .insert({
      id: uuid(),
      task_id: body.taskId,
      user_id: body.userId,
      upload_id: body.uploadId,
      result,
    })
    .returning('*')
    .spread((row) => row)
}

export const getSubmit = (submitId: string) => {
  return knex('submit')
    .leftJoin('upload', 'upload.id', 'submit.upload_id')
    .select(['submit.*', 'upload.created_at'])
    .where({ id: submitId })
    .first()
}

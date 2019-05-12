import knex from '../knex'
import uuid from 'uuid/v4'
import { GetProblemsQueryParams } from '../../types/dbTypes'
import {
  applyDefaultFilterQueryParams,
  countDbRows,
  formatFilterToSqlTarget
} from './queryUtils'
import {
  CreateProblemRequest,
  UpdateProblemRequest
} from '../../types/problemRequestTypes'

export const countProblems = () => countDbRows('problem')
export const getProblems = async (params: GetProblemsQueryParams) => {
  const {
    name,
    _sort,
    _end,
    _order,
    _start,
    exact,
    groupId,
  } = applyDefaultFilterQueryParams(params)

  return knex('problem')
    .groupBy('id')
    .modify((query: any) => {
      if (name) {
        query.where('name', 'like', formatFilterToSqlTarget(name, exact))
      }
      if (groupId) {
        query.orWhere(
          knex.raw('group_id::text'),
          'like',
          formatFilterToSqlTarget(groupId, exact),
        )
      }
    })
    .orderBy(_sort, _order)
    .limit(_end - _start)
    .offset(_start)
}

export const getProblem = (userGroupId: string) => {
  return knex('problem')
    .where({ id: userGroupId })
    .first()
}

export const updateProblem = (
  problemId: string,
  updateProblemRequest: UpdateProblemRequest,
) => {
  return knex('problem')
    .where({ id: problemId })
    .update({ name: updateProblemRequest.name })
    .returning('*')
    .spread((row) => row)
}

export const createProblem = (createProblemRequest: CreateProblemRequest) => {
  return knex('problem')
    .insert({
      id: uuid(),
      name: createProblemRequest.name,
      group_id: createProblemRequest.groupId,
    })
    .returning('*')
    .spread((row) => row)
}

export const removeProblem = (problemId: string) => {
  return knex('problem')
    .where({ id: problemId })
    .delete()
    .returning('*')
    .spread((row) => row)
}

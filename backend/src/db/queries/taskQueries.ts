import knex from '../knex'
import uuid from 'uuid/v4'
import { GetTasksQueryParams } from '../../types/dbTypes'
import {
  applyDefaultFilterQueryParams,
  countDbRows,
  formatFilterToSqlTarget
} from './queryUtils'
import {
  CreateTaskRequest,
  UpdateTaskRequest
} from '../../types/taskRequestTypes'

export const countTasks = () => countDbRows('task')
export const getTasks = async (params: GetTasksQueryParams) => {
  const {
    name,
    _sort,
    _end,
    _order,
    _start,
    exact,
    groupId,
  } = applyDefaultFilterQueryParams(params)

  return knex('task')
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

export const getTask = (userGroupId: string) => {
  return knex('task')
    .where({ id: userGroupId })
    .first()
}

export const updateTask = (
  taskId: string,
  updateTaskRequest: UpdateTaskRequest,
) => {
  return knex('task')
    .where({ id: taskId })
    .update({ name: updateTaskRequest.name })
    .returning('*')
    .spread((row) => row)
}

export const createTask = (createTaskRequest: CreateTaskRequest) => {
  return knex('task')
    .insert({
      id: uuid(),
      name: createTaskRequest.name,
      group_id: createTaskRequest.groupId,
    })
    .returning('*')
    .spread((row) => row)
}

export const removeTask = (taskId: string) => {
  return knex('task')
    .where({ id: taskId })
    .delete()
    .returning('*')
    .spread((row) => row)
}

import knex from '../knex'
import { merge } from 'lodash'
import { DEFAULT_FILTER_PARAMS } from '../../constants'

export const countDbRows = (dbName: string) =>
  knex(dbName)
    .count('id')
    .spread((objCount: any) => objCount.count)

export const formatFilterToSqlTarget = (
  column: string,
  exact: boolean = false,
) => (exact ? `${column}` : `%${column}%`)

export function applyDefaultFilterQueryParams<Params>(params: Params) {
  return merge({}, DEFAULT_FILTER_PARAMS, params)
}

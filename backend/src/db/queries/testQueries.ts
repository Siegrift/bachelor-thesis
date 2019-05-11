import knex from '../knex'

// NOTE: result from DB query is always an array (but often containing only 1 element).
// If you need to flatten the SELECT query result use "knex.first()". For UPDATE, DELETE query
// use "knex.spread((row) => row)".

export const sampleInsertToTestDb = () => {
  return knex('test')
    .insert({ test_field: 'test' })
    .returning('*')
    .spread((row) => row)
}

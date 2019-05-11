import { sampleInsertToTestDb } from '../db/queries/testQueries'
import { basicRequest } from './requestWrapper'

export const testBackendConnection = basicRequest(async ({ response }) => {
  response.json('Backend working :)')
})

export const testDbConnection = basicRequest(async ({ response }) => {
  const dbEntry = await sampleInsertToTestDb()
  response.json(`Database running! Inserted ${JSON.stringify(dbEntry)}`)
})

import { Router } from 'express'
import knex from '../knex/knex'

const router = Router()

router.get('/', (req, res) => {
  res.json('Hello ;)')
})

export default router

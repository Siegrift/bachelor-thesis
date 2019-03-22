import { Router } from 'express'
import {
  loginUser,
  registerUser,
  testBackendConnection,
  testDbConnection
} from './routerHandlers'

const router = Router()

router.get('/', testBackendConnection)
router.get('/db', testDbConnection)

router.post('/register', registerUser)
router.post('/login', loginUser)

export default router

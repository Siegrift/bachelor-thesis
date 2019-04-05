import { Router } from 'express'
import {
  getMockedFile,
  listMockedFiles,
  loginUser,
  registerUser,
  testBackendConnection,
  testDbConnection
} from './routerHandlers'

const router = Router()

router.get('/', testBackendConnection)
router.get('/db', testDbConnection)
router.get('/mockedFiles', listMockedFiles)
router.get('/mockedFiles/:file*', getMockedFile)

router.post('/register', registerUser)
router.post('/login', loginUser)

export default router

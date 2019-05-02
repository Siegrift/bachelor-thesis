import { Router } from 'express'
import {
  getMockedFile,
  listMockedFiles,
  loginUser,
  registerUser,
  runSavedCode,
  saveFiles,
  testBackendConnection,
  testDbConnection
} from './routerHandlers'
import multer from 'multer'

const upload = multer({})
const router = Router()

router.get('/', testBackendConnection)
router.get('/db', testDbConnection)
router.get('/mockedFiles', listMockedFiles)
router.get('/mockedFiles/:file*', getMockedFile)

router.post('/register', registerUser)
router.post('/login', loginUser)
// upload.none() will prevent uploading any files, because we will handle that ourselves
// the functions itself is a middleware, which will check if the request is multipart
// and if not, it will leave the processing of the request to next middleware.
router.post('/saveFiles', upload.none(), saveFiles)
router.post('/runSavedCode/:folder', runSavedCode)

export default router

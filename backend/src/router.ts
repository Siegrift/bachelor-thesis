import { Router } from 'express'
import {
  addUserGroup,
  createGroup,
  getGroup,
  getGroups,
  getMockedFile,
  getUploadedFile,
  getUser,
  getUserGroups,
  getUsers,
  listMockedFiles,
  listUploadedFiles,
  listUploads,
  loginUser,
  registerUser,
  removeGroup,
  removeUser,
  removeUserGroup,
  runSavedCode,
  saveFiles,
  submit,
  testBackendConnection,
  testDbConnection,
  updateGroup,
  updateUser
} from './routerHandlers'
import multer from 'multer'

const upload = multer({})
const router = Router()

// Admin dashboard uses react-admin and it expects a few endpoints exist.
// https://github.com/marmelab/react-admin/tree/master/packages/ra-data-json-server
// The API needs following endpoints:
// GET_LIST	GET - always needed
// GET_ONE	GET - needed only for edit
// CREATE	POST - needed only for create
// UPDATE	PUT - needed only for edit
// DELETE	DELETE - neeeded only for edit
// GET_MANY	GET - TODO: when is it needed?
// GET_MANY_REFERENCE	GET - TODO: when is it needed?
router.get('/users', getUsers)
router.get('/users/:userId', getUser)
router.put('/users/:userId', updateUser)
router.delete('/users/:userId', removeUser)

router.get('/groups', getGroups)
router.get('/groups/:groupId', getGroup)
router.post('/groups', createGroup)
router.put('/groups/:groupId', updateGroup)
router.delete('/groups/:groupId', removeGroup)

router.get('/userGroups', getUserGroups)
router.post('/userGroups', addUserGroup)
router.delete('/userGroups/:userGroupId', removeUserGroup)

router.get('/', testBackendConnection)
router.get('/db', testDbConnection)
router.get('/mockedFiles', listMockedFiles)
router.get('/mockedFiles/:file', getMockedFile)
router.get('/uploads', listUploads)
router.get('/uploads/:upload', listUploadedFiles)
router.get('/uploads/:upload/:file', getUploadedFile)

router.post('/register', registerUser)
router.post('/login', loginUser)
// upload.none() will prevent uploading any files, because we will handle that ourselves
// the functions itself is a middleware, which will check if the request is multipart
// and if not, it will leave the processing of the request to next middleware.
router.post('/saveFiles', upload.none(), saveFiles)
router.post('/runSavedCode/:folder', runSavedCode)
router.post('/submit/:folder', submit)

export default router

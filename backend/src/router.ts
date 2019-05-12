import { Router } from 'express'
import { runSavedCode, submit } from './handlers/runCodeHandlers'
import multer from 'multer'
import {
  createUser,
  getUser,
  getUsers,
  loginUser,
  removeUser,
  updateUser
} from './handlers/userHandlers'
import {
  createGroup,
  getGroup,
  getGroups,
  removeGroup,
  updateGroup
} from './handlers/groupHandlers'
import {
  createUserGroup,
  getUserGroup,
  getUserGroups,
  removeUserGroup,
  updateUserGroup
} from './handlers/userGroupHandlers'
import {
  createProblem,
  getProblem,
  getProblems,
  removeProblem,
  updateProblem
} from './handlers/problemHandlers'
import {
  getUploadedFile,
  listUploadedFiles,
  listUploads,
  saveFiles
} from './handlers/saveHandlers'
import {
  testBackendConnection,
  testDbConnection
} from './handlers/testHandlers'

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
// GET_MANY_REFERENCE - needed only for referencing multiple entities from single entity
//                      (e.g. when visualizing user as he has multiple groups)
router.get('/users', getUsers)
router.get('/users/:userId', getUser)
router.post('/users', createUser)
router.put('/users/:userId', updateUser)
router.delete('/users/:userId', removeUser)
router.post('/login', loginUser)

router.get('/groups', getGroups)
router.get('/groups/:groupId', getGroup)
router.post('/groups', createGroup)
router.put('/groups/:groupId', updateGroup)
router.delete('/groups/:groupId', removeGroup)

router.get('/userGroups', getUserGroups)
router.get('/userGroups/:userGroupId', getUserGroup)
router.post('/userGroups', createUserGroup)
// NOTE: this request is only needed for react-admin. We do not support updating user group.
router.put('/userGroups/:userGroupId', updateUserGroup)
router.delete('/userGroups/:userGroupId', removeUserGroup)

router.get('/problems', getProblems)
router.get('/problems/:problemId', getProblem)
router.post('/problems', createProblem)
router.put('/problems/:problemId', updateProblem)
router.delete('/problems/:problemId', removeProblem)

router.get('/uploads', listUploads)
router.get('/uploads/:upload', listUploadedFiles)
router.get('/uploads/:upload/:file', getUploadedFile)

// upload.none() will prevent uploading any files, because we will handle that ourselves
// the functions itself is a middleware, which will check if the request is multipart
// and if not, it will leave the processing of the request to next middleware.
router.post('/saveFiles', upload.none(), saveFiles)
router.post('/runSavedCode/:folder', runSavedCode)
router.post('/submit/:folder', submit)

// NOTE: these endpoints only serve for testing purposes
router.get('/', testBackendConnection)
router.get('/db', testDbConnection)

export default router

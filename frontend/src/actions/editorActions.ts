import { Action, State, Thunk } from '../redux/types'
import {
  DialogType,
  EditorState,
  SandboxResponse,
  SubmitResponse,
  TaskFile,
  UploadsState
} from '../types/common'
import { reduce } from 'lodash'
import { AUTOSAVE_UPLOAD_NAME, SAVE_ENTRY_AS_KEY } from '../constants'
import { createEditorTabs } from './tabActions'

export const addEditorInstance = (
  id: string,
  editorInstance: EditorState,
): Action<any> => ({
  type: 'Add new editor instance',
  payload: { id, editorInstance },
  reducer: (state: State) => ({
    ...state,
    editors: { ...state.editors, [id]: editorInstance },
  }),
})

export const createUpload = (
  saveEntryName: string,
  isAutosave: boolean,
): Thunk => async (dispatch, getState, { api, logger }) => {
  logger.log('Save files (upload to BE)')
  const state = getState()

  const files = reduce(
    state.editors,
    (acc, editor, key) => {
      if (!editor) return acc
      else return { ...acc, [key]: editor.editorRef.getValue() }
    },
    {},
  )

  return api.createUpload({
    [SAVE_ENTRY_AS_KEY]: saveEntryName,
    files,
    createdAt: new Date().toISOString(),
    taskId: state.selectedTaskId!,
    userId: state.user!.id,
    isAutosave,
  })
}

export const runCode = (customInput: string): Thunk<SandboxResponse> => async (
  dispatch,
  getState,
  { api, logger },
): Promise<SandboxResponse> => {
  logger.log('Upload and run code')

  const upload = await dispatch(createUpload(AUTOSAVE_UPLOAD_NAME, true))
  return api.runSavedCode({
    input: customInput,
    uploadId: upload.id,
    taskId: getState().selectedTaskId!,
  })
}

export const setDialogValue = (value: DialogType): Action<string> => ({
  type: 'Toggle dialog value',
  payload: value,
  reducer: (state: State) => {
    return { ...state, dialog: value }
  },
})

const setUploadsState = (uploadsState: UploadsState): Action<UploadsState> => ({
  type: 'Set upload state',
  payload: uploadsState,
  reducer: (state: State) => {
    return { ...state, uploadsState }
  },
})

export const getUploads = (): Thunk => async (
  dispatch,
  getState,
  { api, logger },
) => {
  logger.log('Get uploaded files')
  const state = getState()

  dispatch(setUploadsState({ ...state.uploadsState, fetching: true }))
  const newUploads = await api.getUploads({
    userId: state.user!.id,
    taskId: state.selectedTaskId!,
    conjunction: true,
    exact: true,
  })
  dispatch(setUploadsState({ uploads: newUploads, fetching: false }))
}

const removeAllTaskFiles = (): Action => ({
  type: 'Remove all task files',
  reducer: (state: State) => ({
    ...state,
    files: {},
    editors: {},
    tabs: [],
  }),
})

export const getUpload = (entryName: string): Thunk => async (
  dispatch,
  getState,
  { api, logger },
) => {
  logger.log('Get upload from BE')
  const upload = await api.getUpload(entryName)

  dispatch(removeAllTaskFiles())
  dispatch(createEditorTabs(upload.files.map((file) => file.name)))
  dispatch(
    addTaskFiles(
      upload.files.map((file) => ({ ...file, forceLocalInitialization: true })),
    ),
  )
}

/**
 * This action will save the file content to redux and initializes an empty editor,
 * which will be later populated in EditorScreen component. We use the filename as
 * key, because we have guaranteed that it will be unique.
 */
const addTaskFiles = (taskFiles: TaskFile[]): Action<TaskFile[]> => ({
  type: 'Add task files to state',
  payload: taskFiles,
  reducer: (state: State) => {
    let newState = state
    taskFiles.forEach((taskFile) => {
      newState = {
        ...newState,
        files: { ...newState.files, [taskFile.name]: taskFile },
        editors: { ...newState.editors, [taskFile.name]: undefined },
      }
    })

    return newState
  },
})

export const getTask = (): Thunk => async (dispatch, getState, { api }) => {
  const state = getState()
  const task = await api.getTask(state.selectedTaskId!)

  dispatch(createEditorTabs(task.files.map((p) => p.name)))
  task.files.forEach((file) => {
    dispatch(addTaskFiles([file]))
  })
}

export const submitCode = (): Thunk<SubmitResponse> => async (
  dispatch,
  getState,
  { api, logger },
): Promise<SubmitResponse> => {
  logger.log('Submit code')
  const state = getState()

  const upload = await dispatch(createUpload(AUTOSAVE_UPLOAD_NAME, true))
  return api.submitCode({
    uploadId: upload.id,
    taskId: state.selectedTaskId!,
    userId: state.user!.id,
  })
}

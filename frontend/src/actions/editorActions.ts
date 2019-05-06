import { Action, State, Thunk } from '../redux/types'
import {
  DialogType,
  EditorState,
  SandboxResponse,
  SubmitResponse,
  TaskFile,
  UploadState
} from '../types/common'
import { forEach } from 'lodash'
import { SAVE_ENTRY_AS_KEY } from '../constants'
import { formatSaveFolderName } from '../utils'
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

export const saveFiles = (saveEntryName: string): Thunk => async (
  dispatch,
  getState,
  { api, logger },
) => {
  logger.log('Save files (upload to backend)')
  const formData = new FormData()
  const editors = getState().editors

  formData.append(SAVE_ENTRY_AS_KEY, saveEntryName)
  forEach(editors, (editor, key) => {
    if (!editor) return
    formData.append(key, editor.editorRef.getValue())
  })

  api.saveFiles(formData)
}

export const runCode = (customInput: string): Thunk<SandboxResponse> => async (
  dispatch,
  getState,
  { api, logger },
): Promise<SandboxResponse> => {
  logger.log('Upload and run code')
  const folder = formatSaveFolderName('Autosave')

  await dispatch(saveFiles(folder))
  return api.runSavedCode(folder, customInput)
}

export const setDialogValue = (value: DialogType): Action<string> => ({
  type: 'Toggle dialog value',
  payload: value,
  reducer: (state: State) => {
    return { ...state, dialog: value }
  },
})

const setUploadState = (uploadState: UploadState): Action<UploadState> => ({
  type: 'Set upload state',
  payload: uploadState,
  reducer: (state: State) => {
    return { ...state, uploads: uploadState }
  },
})

export const listUploads = (): Thunk => async (
  dispatch,
  getState,
  { api, logger },
) => {
  logger.log('List uploaded files')
  const uploads = getState().uploads

  dispatch(setUploadState({ ...uploads, fetching: true }))
  const newUploads = await api.listUploads()
  dispatch(setUploadState({ entries: newUploads, fetching: false }))
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

export const loadFiles = (entryName: string): Thunk => async (
  dispatch,
  getState,
  { api, logger },
) => {
  logger.log('Load files from BE')
  const uploadFiles = await api.listUploadFiles(entryName)

  // start doing request at once and wait for all of them
  const requests = uploadFiles.map(
    async (file, i): Promise<TaskFile> => {
      const content = await api.downloadUploadFile(entryName, file)
      return { name: uploadFiles[i], content }
    },
  )

  const results = await Promise.all(requests)
  dispatch(removeAllTaskFiles())
  dispatch(createEditorTabs(uploadFiles))
  dispatch(
    addTaskFiles(results.map((r) => ({ ...r, forceLocalInitialization: true }))),
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

export const downloadTaskFiles = (): Thunk => async (
  dispatch,
  getState,
  { api },
) => {
  try {
    const taskFiles = await api.downloadTaskFiles()
    dispatch(createEditorTabs(taskFiles))

    // we want to do this asynchronously so that we are not blocking the editor
    taskFiles.forEach(async (file, i) => {
      const content = await api.getFile(file)
      dispatch(
        addTaskFiles([
          {
            name: taskFiles[i],
            content,
          },
        ]),
      )
    })
  } catch (err) {
    console.error('Error fetching task files', err)
  }
}

export const submitCode = (): Thunk<SubmitResponse> => async (
  dispatch,
  getState,
  { api, logger },
): Promise<SubmitResponse> => {
  logger.log('Submit code')
  const folder = formatSaveFolderName('Autosave')

  await dispatch(saveFiles(folder))
  return api.submitCode(folder)
}

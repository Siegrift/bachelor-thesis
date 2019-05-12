import { Action, State, Thunk } from '../redux/types'
import {
  DialogType,
  EditorState,
  ProblemFile,
  SandboxResponse,
  SubmitResponse,
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

const removeAllProblemFiles = (): Action => ({
  type: 'Remove all problem files',
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
    async (file, i): Promise<ProblemFile> => {
      const content = await api.downloadUploadFile(entryName, file)
      return { name: uploadFiles[i], content }
    },
  )

  const results = await Promise.all(requests)
  dispatch(removeAllProblemFiles())
  dispatch(createEditorTabs(uploadFiles))
  dispatch(
    addProblemFiles(
      results.map((r) => ({ ...r, forceLocalInitialization: true })),
    ),
  )
}

/**
 * This action will save the file content to redux and initializes an empty editor,
 * which will be later populated in EditorScreen component. We use the filename as
 * key, because we have guaranteed that it will be unique.
 */
const addProblemFiles = (
  problemFiles: ProblemFile[],
): Action<ProblemFile[]> => ({
  type: 'Add problem files to state',
  payload: problemFiles,
  reducer: (state: State) => {
    let newState = state
    problemFiles.forEach((problemFile) => {
      newState = {
        ...newState,
        files: { ...newState.files, [problemFile.name]: problemFile },
        editors: { ...newState.editors, [problemFile.name]: undefined },
      }
    })

    return newState
  },
})

export const downloadProblemFiles = (): Thunk => async (
  dispatch,
  getState,
  { api },
) => {
  const state = getState()
  const problem = await api.getProblem(state.selectedProblemId!)

  dispatch(createEditorTabs(problem.files.map((p) => p.name)))
  problem.files.forEach((file) => {
    dispatch(addProblemFiles([file]))
  })
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

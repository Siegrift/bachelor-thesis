import { Action, State, Thunk } from '../redux/types'
import { EditorState } from '../types/common'
import { forEach } from 'lodash'
import { SAVE_ENTRY_AS_KEY } from '../constants'
import { formatRunCodeAutosaveFolderName } from '../utils'

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

export const runCode = (): Thunk => async (
  dispatch,
  getState,
  { api, logger },
) => {
  logger.log('Upload and run code')
  const folder = formatRunCodeAutosaveFolderName()

  await dispatch(saveFiles(folder))
  const text = await api.runSavedCode(folder)
  console.log(text)
}

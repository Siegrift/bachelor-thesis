import { Action, State, Thunk } from '../redux/types'
import { EditorState } from '../types/common'
import { forEach } from 'lodash'
import { SAVE_ENTRY_AS_KEY } from '../constants'

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

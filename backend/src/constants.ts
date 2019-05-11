import { join } from 'path'

// the same property is used in FE, be sure to keep in sync
export const SAVE_ENTRY_AS_KEY = '__saveEntryName__'

export const PROBLEMS_PATH = join(__dirname, '../problems')
export const UPLOADS_PATH = join(__dirname, '../uploads')

export const DEFAULT_TIMEOUT = 5 // in seconds
export const SANDBOX_TESTING_PATH = join(__dirname, 'sandbox', 'temp')

export const FORBIDDEN = 403
export const OK = 200
export const BAD_REQUEST = 400

export const DEFAULT_FILTER_PARAMS = {
  // NOTE: strange naming is because this is used by react admin intenally
  _sort: 'id', // every table should have column 'id'
  _order: 'ASC',
  _end: 20,
  _start: 0,
  // but we extend the filtering with (optional) custom properties
  exact: false,
}

import { join } from 'path'

// the same property is used in FE, be sure to keep in sync
export const SAVE_ENTRY_AS_KEY = '__saveEntryName__'

export const PROBLEMS_PATH = join(__dirname, '../problems')
export const UPLOADS_PATH = join(__dirname, '../uploads')

export const DEFAULT_TIMEOUT = 5 // in seconds
export const SANDBOX_TESTING_PATH = join(__dirname, 'sandbox', 'temp')

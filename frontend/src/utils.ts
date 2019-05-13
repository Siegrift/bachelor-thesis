import { camelCase, forEach, isArray, isPlainObject } from 'lodash'

const extensionToLanguage = new Map<string, string>()
extensionToLanguage.set('clj', 'clojure')
extensionToLanguage.set('cs', 'csharp')
extensionToLanguage.set('css', 'css')
extensionToLanguage.set('go', 'go')
extensionToLanguage.set('cpp', 'cpp')
extensionToLanguage.set('cc', 'cpp')
extensionToLanguage.set('c', 'cpp')
extensionToLanguage.set('go', 'go')
extensionToLanguage.set('html', 'html')
extensionToLanguage.set('java', 'java')
extensionToLanguage.set('js', 'javascript')
extensionToLanguage.set('json', 'json')
extensionToLanguage.set('less', 'less')
extensionToLanguage.set('lua', 'lua')
extensionToLanguage.set('md', 'markdown')
extensionToLanguage.set('mm', 'objective')
extensionToLanguage.set('pl', 'perl')
extensionToLanguage.set('plc', 'perl')
extensionToLanguage.set('pld', 'perl')
extensionToLanguage.set('php', 'php')
extensionToLanguage.set('py', 'python')
extensionToLanguage.set('rb', 'ruby')
extensionToLanguage.set('rs', 'rust')
extensionToLanguage.set('scss', 'scss')
extensionToLanguage.set('sql', 'sql')
extensionToLanguage.set('swift', 'swift')
extensionToLanguage.set('ts', 'typescript')
extensionToLanguage.set('vb', 'vb')
extensionToLanguage.set('xml', 'xml')
extensionToLanguage.set('yaml', 'yaml')

export const parseLanguageFromFileName = (filename: string): string => {
  const ext = filename.split('.').pop()!
  return extensionToLanguage.get(ext) || ''
}

// https://stackoverflow.com/questions/12931828/convert-returned-json-object-properties-to-lower-first-camelcase
export const convertToCamelCase = (snakeCaseObject: any) => {
  const camelCaseObject = isArray(snakeCaseObject) ? [] : ({} as any)
  forEach(snakeCaseObject, (value, key) => {
    if (isPlainObject(value) || isArray(value)) {
      value = convertToCamelCase(value)
    }
    camelCaseObject[camelCase(key)] = value
  })
  return camelCaseObject
}

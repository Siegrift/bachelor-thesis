import fs from 'fs'

export const readFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, file) => {
      if (error) reject(error)
      else resolve(file)
    })
  })
}

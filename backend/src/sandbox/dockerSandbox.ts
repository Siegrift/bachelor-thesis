import { CompileScript } from './sandbox'
import { ensureDir, readFile, writeFile } from 'fs-extra'
import { join } from 'path'
import {
  DEFAULT_TIMEOUT,
  SANDBOX_TESTING_PATH,
  TASKS_PATH,
  UPLOADS_PATH
} from '../constants'
import { execute } from '../utils'

export interface SandboxResponse {
  data: string
  executionTime: number
  error: string
}

class DockerSandbox {
  timeout: number

  constructor(
    private uploadId: string,
    private taskId: string,
    private compileScript: CompileScript,
  ) {
    this.timeout = compileScript.timeout || DEFAULT_TIMEOUT
  }

  async run(): Promise<SandboxResponse> {
    await this.prepare()
    return this.executeCode()
  }

  async prepare(): Promise<void> {
    await ensureDir(SANDBOX_TESTING_PATH)
    const dest = join(SANDBOX_TESTING_PATH, this.uploadId)

    await execute(`mkdir ${dest}`)
    await execute(`cp ${join(__dirname, 'payload/*')} ${dest}`)
    await execute(`mkdir ${join(dest, 'public')}`)
    await execute(
      `cp -r ${join(UPLOADS_PATH, this.uploadId, '*')} ${join(dest, 'public')}`,
    )
    await execute(
      `cp -r ${join(TASKS_PATH, `${this.taskId}/hidden`)} ${join(dest)}`,
    )
    await execute(`chmod 777 ${dest}`)

    // copy custom input to the input file as it should be run with highest precedence
    const { customInput } = this.compileScript
    if (customInput) {
      const inputFilePath = join(dest, 'inputFile')
      await writeFile(inputFilePath, customInput)
    }
  }

  executeCode(): Promise<SandboxResponse> {
    return new Promise((resolve) => {
      const {
        inputFile,
        compiler,
        executable,
        sources,
        additionalArguments,
        customInput,
      } = this.compileScript
      let myC = 0 // variable to enforce the timeout
      const sandbox = this
      const dest = join(SANDBOX_TESTING_PATH, this.uploadId)
      const commandInputFile = customInput
        ? 'inputFile'
        : inputFile || 'inputFile'

      // this statement is what is executed
      const st = `${join(__dirname, 'dockerTimeout.sh')} ${
        this.timeout
      }s -u mysql -e 'NODE_PATH=/usr/local/lib/node_modules' -i -t -v "${dest}":/usercode virtual_machine /usercode/script.sh ${compiler} ${sources} ${executable} ${commandInputFile} ${additionalArguments}`

      console.log(st)

      // execute the Docker, This is done ASYNCHRONOUSLY and we don't want to wait for the promise
      // as it may never finish...
      execute(st)
      console.log('------------------------------')
      // Check For File named "completed" after every 1 second
      const intid = setInterval(() => {
        // Displaying the checking message after 1 second interval, testing purposes only
        console.log(
          `Checking ${join(
            SANDBOX_TESTING_PATH,
            sandbox.uploadId,
          )} for completion: ${myC}`,
        )

        myC++

        readFile(
          join(dest, 'completed'),
          'utf8',
          async (err: any, data: any) => {
            // if file is not available yet and the file interval is not yet up carry on
            if (err && myC < sandbox.timeout) return

            // if file is found simply display a message and proceed
            if (myC < sandbox.timeout) {
              console.log('TESTING DONE')
              // check for possible errors
              readFile(
                __dirname + sandbox.uploadId + '/errors',
                'utf8',
                (err2: any, data2: any) => {
                  if (!data2) data2 = ''

                  const lines = data
                    .toString()
                    .split('*-COMPILEBOX::ENDOFOUTPUT-*')
                  data = lines[0]
                  const time = lines[1]

                  console.log(`Time: ${time}`)
                  resolve({ data, executionTime: time, error: data2 })
                },
              )
            }
            // if time is up. Save an error message to the data variable
            else {
              // Since the time is up, we take the partial output and return it.
              readFile(
                __dirname + sandbox.uploadId + '/logfile.txt',
                'utf8',
                (fileErr: any, fileData: any) => {
                  readFile(
                    __dirname + sandbox.uploadId + '/errors',
                    'utf8',
                    (err2: any, errorData: any) => {
                      if (!errorData) errorData = ''
                      if (!fileData) fileData = ''

                      const lines = fileData.toString().split('*---*')
                      fileData = lines[0]

                      console.log(`Time: -1`)

                      resolve({
                        data: fileData,
                        executionTime: -1,
                        error: errorData,
                      })
                    },
                  )
                },
              )
            }

            // now remove the temporary directory
            console.log(
              `ATTEMPTING TO REMOVE: ${join(
                __dirname,
                'temp',
                sandbox.uploadId,
              )}`,
            )
            await execute(`rm -r ${join(__dirname, 'temp', sandbox.uploadId)}`)

            clearInterval(intid)
          },
        )
      }, 1000)
    })
  }
}
export default DockerSandbox

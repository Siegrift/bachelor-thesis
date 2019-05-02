import { CompileScript } from './sandbox'
import { exec, ExecException } from 'child_process'
import { readFile } from 'fs-extra'
import { join } from 'path'
import {
  DEFAULT_TIMEOUT,
  PROBLEMS_PATH,
  SANDBOX_TESTING_PATH,
  UPLOADS_PATH
} from '../constants'

export interface SandboxResponse {
  data: string
  executionTime: number
  error: string
}

class DockerSandbox {
  timeout: number

  constructor(private folder: string, private compileScript: CompileScript) {
    this.timeout = compileScript.timeout || DEFAULT_TIMEOUT
  }

  async run(): Promise<SandboxResponse> {
    await this.prepare()
    return this.execute()
  }

  prepare(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dest = join(SANDBOX_TESTING_PATH, this.folder)
      exec(
        `mkdir ${dest}` +
          ` && cp ${join(__dirname, 'payload/*')} ${dest}` +
          ` && mkdir ${join(dest, 'public')}` +
          ` && cp -r ${join(UPLOADS_PATH, this.folder, '*')} ${join(
            dest,
            'public',
          )}` +
          // TODO: this only works for one problem
          ` && cp -r ${join(PROBLEMS_PATH, 'mocked-data/hidden')} ` +
          `${join(dest)}` +
          ` && chmod 777 ${dest}`,
        (err: ExecException | null) => {
          if (err) {
            console.error(err)
            reject()
          } else {
            resolve()
          }
        },
      )
    })
  }

  execute(): Promise<SandboxResponse> {
    return new Promise((resolve) => {
      let myC = 0 // variable to enforce the timeout
      const sandbox = this
      const dest = join(SANDBOX_TESTING_PATH, this.folder)

      // this statement is what is executed
      const st = `${join(__dirname, 'dockerTimeout.sh')} ${
        this.timeout
      }s -u mysql -e 'NODE_PATH=/usr/local/lib/node_modules' -i -t -v "${dest}":/usercode virtual_machine /usercode/script.sh ${
        this.compileScript.compiler
      } ${this.compileScript.sources} ${this.compileScript.executable} ${
        this.compileScript.inputFile
      } ${this.compileScript.additionalArguments}`

      console.log(st)

      // execute the Docker, This is done ASYNCHRONOUSLY
      exec(st)
      console.log('------------------------------')
      // Check For File named "completed" after every 1 second
      const intid = setInterval(() => {
        // Displaying the checking message after 1 second interval, testing purposes only
        console.log(
          `Checking ${join(
            SANDBOX_TESTING_PATH,
            sandbox.folder,
          )} for completion: ${myC}`,
        )

        myC++

        readFile(join(dest, 'completed'), 'utf8', (err: any, data: any) => {
          // if file is not available yet and the file interval is not yet up carry on
          if (err && myC < sandbox.timeout) return

          // if file is found simply display a message and proceed
          if (myC < sandbox.timeout) {
            console.log('TESTING DONE')
            // check for possible errors
            readFile(
              __dirname + sandbox.folder + '/errors',
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
              __dirname + sandbox.folder + '/logfile.txt',
              'utf8',
              (fileErr: any, fileData: any) => {
                readFile(
                  __dirname + sandbox.folder + '/errors',
                  'utf8',
                  (err2: any, data2: any) => {
                    if (!data2) data2 = ''

                    const lines = fileData.toString().split('*---*')
                    fileData = lines[0]
                    const time = lines[1]

                    console.log(`Time: ${time}`)

                    resolve({
                      data: fileData,
                      executionTime: -1,
                      error: data2,
                    })
                  },
                )
              },
            )
          }

          // now remove the temporary directory
          console.log('ATTEMPTING TO REMOVE: ' + __dirname + sandbox.folder)
          exec(`rm -r ${join(__dirname, 'temp', sandbox.folder)}`)

          clearInterval(intid)
        })
      }, 1000)
    })
  }
}
export default DockerSandbox

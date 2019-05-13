import DockerSandbox, { SandboxResponse } from './dockerSandbox'

export interface CompileScript {
  compiler: string
  sources: string
  executable: string
  inputFile?: string
  timeout?: number
  compilerName: string
  additionalArguments?: string
  // custom input has higher precedence than 'inputFile'
  customInput?: string
}

export const runInSandBox = (
  uploadId: string,
  taskId: string,
  compileScript: CompileScript,
): Promise<SandboxResponse> => {
  return new Promise(async (resolve) => {
    const sandbox = new DockerSandbox(uploadId, taskId, compileScript)
    const response = await sandbox.run()

    resolve(response)
  })
}

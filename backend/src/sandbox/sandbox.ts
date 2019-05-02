import DockerSandbox, { SandboxResponse } from './dockerSandbox'

export interface CompileScript {
  compiler: string
  sources: string
  executable: string
  inputFile?: string
  timeout?: number
  compilerName: string
  additionalArguments?: string
}

export const runInSandBox = (
  folder: string,
  compileScript: CompileScript,
): Promise<SandboxResponse> => {
  return new Promise(async (resolve) => {
    const sandbox = new DockerSandbox(folder, compileScript)
    const response = await sandbox.run()

    resolve(response)
  })
}

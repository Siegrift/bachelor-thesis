import { exec, ExecException } from 'child_process'

export const execute = (
  command: string,
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    exec(
      command,
      (err: ExecException | null, stdout: string, stderr: string) => {
        if (err) {
          reject(err)
        } else {
          resolve({ stdout, stderr })
        }
      },
    )
  })
}

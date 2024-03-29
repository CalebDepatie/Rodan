import { SSHConnection } from 'node-ssh-forward'

let sshConnection: SSHConnection

export async function openSSH(password:string) {
  try {
    sshConnection = new SSHConnection({
      endHost: process.env.REMOTE_HOST,
      username: process.env.REMOTE_USER,
      password: password
    })
    await sshConnection.forward({
      fromPort: process.env.PORT,
      toPort: process.env.PORT,
      toHost: 'localhost',
    })

    return {}
  } catch (err) {
    return {
      error: err
    }
  }

}

export async function closeSSH() {
  if (sshConnection)
    await sshConnection.shutdown()
}

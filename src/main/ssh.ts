import * as cp from 'child_process';

let childProcess

export async function openSSH() {
  childProcess = await cp.exec(`ssh -L ${process.env.PORT}:localhost:${process.env.PORT} ${process.env.REMOTE_USER}@${process.env.REMOTE_HOST}`, {
    windowsHide: false,
    shell: process.platform === 'windows' ? '%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe' : undefined
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout:\n${stdout}`);
  });
};

export async function closeSSH() {
  await childProcess.kill();
};

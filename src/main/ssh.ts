import * as cp from 'child_process';

let childProcess

export async function openSSH() {
  let command;
  switch (process.platform) {
    case "win32": {
      command = `Start-Process -FilePath \"powershell\" -ArgumentList \"/c ssh -L ${process.env.PORT}:localhost:${process.env.PORT} ${process.env.REMOTE_USER}@${process.env.REMOTE_HOST}\"`
      break;
    }
    case "linux": {
      command = `kitty ssh -L ${process.env.PORT}:localhost:${process.env.PORT} ${process.env.REMOTE_USER}@${process.env.REMOTE_HOST}`
      break;
    }
    default: throw new Error("Cannot open tunnel, undefined platform")
  }

  childProcess = cp.exec(command, {
    windowsHide: false,
    shell: process.platform === 'win32' ? 'powershell.exe' : undefined
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
  (await childProcess).kill();
};

import { spawn as childProcessSpawn } from 'child_process';

import consola from 'consola';

/**
 * Spawns a subprocess and observes it
 *
 * @param command
 * @param commandArgs
 */
export const spawn = async (command: string, commandArgs: string[] = []): Promise<number> => {
  return new Promise((resolve, reject) => {
    const childProcess = childProcessSpawn(command, commandArgs, { stdio: "inherit" });

    consola.info(`Executing: '${command} ${(commandArgs || []).join(' ')}'`);

    childProcess.on('exit', (code) => {
      const exitCode = code || 0;

      if (exitCode !== 0) {
        return reject(exitCode);
      }

      resolve(exitCode);
    });

    // Makes sure that if we CTRL+C the script
    // we also kill the spawned child process
    process.on('SIGINT', () => {
      childProcess.kill();
      process.exit();
    });
  })
};

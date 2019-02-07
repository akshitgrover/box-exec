/*

Copyright 2018 Akshit Grover

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const { startContainers } = require('./setup.js');

const lockScheduling = () => {
  try {
    fs.writeFileSync(
      path.join(__dirname, '../config/.schedule.lock'),
      'true\n',
    );
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  }
};

const releaseLock = () => {
  try {
    fs.writeFileSync(
      path.join(__dirname, '../config/.schedule.lock'),
      'false\n',
    );
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  }
};

const fetchContainers = (next) => {
  cp.exec('docker container ls -a --format={{.Names}}==={{.Status}}',
    (err, stdout, stderr) => {
      if (err || stderr) {
        process.stderr.write('Error fetching running containers\n');
        process.exit(1);
      }
      if (stdout.trim() === '') {
        startContainers(releaseLock);
        return null;
      }
      const containers = stdout.trim().split('\n');
      next(containers);
      return null;
    });
};

const renameRunningContainers = () => {
  let count = 0;
  let containersNum = 0;
  const status = [];
  const cb = () => {
    count += 1;
    if (count === containersNum && status.length === 0) {
      startContainers(releaseLock);
    } else if (count === containersNum && status.length !== 0) {
      status.forEach((errTxt) => {
        process.stdout.write(`${errTxt}\n`);
      });
    }
  };
  const rename = (containerName) => {
    const d = new Date();
    const flagName = `${containerName}${d.getHours()}d${d.getMinutes()}m${d.getSeconds()}_tmp`;
    cp.exec(`docker container rename ${containerName} ${flagName}`,
      (err, stdout, stderr) => {
        if (err || stderr) {
          status.push(`
          Error renaming container ${containerName}\nManual renaming is required:
          'docker container rename ${containerName} ${flagName}'
          `.trim());
        }
        cb();
      });
  };
  const remove = (containerName) => {
    cp.exec(`docker container rm ${containerName}`, (err, stdout, stderr) => {
      if (err || stderr) {
        status.push(`
        Error deleting container ${containerName}\nManual deletion is required:
        'docker container rm ${containerName}'
        `.trim());
      }
      cb();
    });
  };
  fetchContainers((containers) => {
    containersNum = containers.length;
    containers.forEach((containerName) => {
      const [name, stats] = containerName.split('===');
      if (!name.startsWith('box-exec')) {
        cb();
        return null;
      }
      if (stats.startsWith('Up')) {
        rename(name);
      } else {
        remove(name);
      }
      return null;
    });
  });
};

module.exports = () => {
  lockScheduling();
  renameRunningContainers();
};

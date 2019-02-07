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

const cp = require('child_process');

const imageObj = require('../src/dockerimageLib.js');
const cpuDistribution = require('../config/.cpudist.json');
const containers = require('../config/.containers.json');

const startContainers = (cb) => {
  Object.keys(cpuDistribution).forEach((l) => {
    const containerName = `box-exec-${l}`;
    const image = imageObj[l];
    const num = containers[l];
    const cpus = (cpuDistribution[l] / num).toFixed(2);
    for (let i = 0; i < num; i += 1) {
      cp.exec(`
        docker container run -id --cpus ${cpus} --name ${containerName}-${i} ${image}
        `, (error, stdout, stderr) => {
        const stderrSplit = stderr.split(' ');
        if (stderrSplit.indexOf('Conflict.') === -1 && stderr.length > 0) {
          throw new Error(stderr);
        }
        if (cb instanceof Function && i === num - 1) {
          cb();
        }
        process.stdout.write(`${containerName}-${i} container is running with CPUS = ${cpus}\n`);
      });
    }
  });
};

module.exports = () => {
  cp.exec('docker container ls -a --format "{{.Names}}"', (err, stdout, stderr) => {
    if (err || stderr) {
      process.stderr.write((err) ? `${err.message}\n` : `${stderr.message}\n`);
      process.exit(1);
    }
    const sout = stdout.trim();
    if (sout === '') {
      startContainers();
      return;
    }
    let count = 0;
    const containerNames = sout.split('\n');
    const cb = () => {
      count += 1;
      if (count === containerNames.length) {
        startContainers();
      }
    };
    containerNames.forEach((name) => {
      if (!name.startsWith('box-exec')) {
        cb();
        return null;
      }
      cp.exec(`docker container rm ${name} --force`, (e, _, serr) => {
        if (e || serr) {
          process.stderr((e) ? `${e.message}\n` : `${serr.message}\n`);
          process.exit(1);
        }
        cb();
      });
      return null;
    });
  });
};

module.exports.startContainers = startContainers;

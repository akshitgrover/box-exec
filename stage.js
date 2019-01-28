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

const child = require('child_process');
const fs = require('fs');

const ConcurrencyHandler = require('./concurrencyHandler.js');
const { getStageFourTimeout, cpuDistribution } = require('./utils.js');

const queue = new ConcurrencyHandler();

// Stage One : Check State Of Container

const one = (image, lang) => {
  const containerName = `box-exec-${lang}`;
  const cpus = cpuDistribution[lang];
  return new Promise((resolve, reject) => {
    child.exec(`docker container inspect --format {{.State.Status}} ${containerName}`, (error, stdout, stderr) => {
      if (stderr) {
        child.exec(`docker container run --cpus ${cpus} -id --name ${containerName} ${image}`, (errorf, stdoutf, stderrf) => {
          if (errorf || stderrf) {
            reject();
          }
          resolve();
        });
      } else if (stdout !== 'running\n') {
        child.exec(`docker container start ${containerName}`, (errorf, stdoutf, stderrf) => {
          if (errorf || stderrf) {
            reject();
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

// Stage Two : Copy Source Code File In The Container

const two = (lang, codefile) => {
  const containerName = `box-exec-${lang}`;
  return new Promise((resolve, reject) => {
    child.exec(`docker cp ${codefile} ${containerName}:/`, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
      }
      resolve(stdout);
    });
  });
};

// Stage Three: Compile Source Code File (only for c/c++)

const three = (lang, cfile) => {
  let codefile = cfile;
  const containerName = `box-exec-${lang}`;
  codefile = codefile.replace(/\\/g, '/');
  codefile = codefile.split('/');
  const filename = codefile[codefile.length - 1];
  const rawName = `${filename.slice(0, filename.indexOf('.'))}.out`;
  return new Promise((resolve, reject) => {
    child.exec(`docker container exec ${containerName} g++ -o ${rawName} ${filename}`,
      (err, stdout, stderr) => {
        let error = err;
        if (error) {
          const idx = error.message.indexOf('\n');
          error = error.message.slice(idx, error.length);
          reject(error);
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      });
  });
};

// Stage Four: Execute Source Code

const four = (lang, cfile, testcasefiles, command) => {
  let codefile = cfile;
  const containerName = `box-exec-${lang}`;
  codefile = codefile.replace(/\\/g, '/');
  codefile = codefile.split('/');
  let filename = codefile[codefile.length - 1];
  if (lang === 'c' || lang === 'cpp') {
    filename = `${filename.slice(0, filename.indexOf('.'))}.out`;
  }
  return new Promise((resolve) => {
    const result = {};

    let count = 0;
    const innerCb = () => {
      queue.queueNext();
      count += 1;
      if (count === testcasefiles.length) {
        resolve(result);
      }
    };

    for (let idx = 0; idx < testcasefiles.length; idx += 1) {
      const testcasefile = testcasefiles[idx].file;
      const timeOutBar = parseFloat(testcasefiles[idx].timeout) * 3000;
      const asyncTask = () => {
        let timeOut;
        let runTimeDuration = 0;
        const testCaseStream = fs.createReadStream(testcasefile);
        const childProcess = child.exec(`docker container exec -i ${containerName} ${command}${filename}`,
          (error, stdout, stderr) => {
            clearTimeout(timeOut);
            testCaseStream.unpipe();
            testCaseStream.destroy();
            if (error) {
              innerCb();
              result[testcasefile] = { error: true, timeout: false, output: "Internal server error. Couldn't execute the program." };
              return null;
            }
            runTimeDuration = (new Date()).getTime() - runTimeDuration;
            if (stderr) {
              innerCb();
              result[testcasefile] = { error: true, timeout: false, output: stderr.trim() };
              return null;
            }
            if (parseFloat(runTimeDuration / 1000) > parseFloat(testcasefiles[idx].timeout)
              || childProcess.killed === true) {
              innerCb();
              result[testcasefile] = { error: true, timeout: true, output: `TLE ${runTimeDuration / 1000}s` };
              return null;
            }
            innerCb();
            result[testcasefile] = { error: false, output: stdout.trim() };
            return null;
          });
        testCaseStream.pipe(childProcess.stdin);
        runTimeDuration = (new Date()).getTime();
        timeOut = getStageFourTimeout(childProcess, timeOutBar, queue);
      };
      queue.queuePush(asyncTask);
    }
  });
};

module.exports = {
  one,
  two,
  three,
  four,
};

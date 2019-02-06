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
const { promisify } = require('util');

const cpuDistribution = require('../config/.cpudist.json');
const ConcurrencyHandler = require('./concurrencyHandler.js');
const { getStageFourTimeout } = require('./utils.js');
const { getContainer } = require('./loadbalancer/balancer.js');
const scheduler = require('./loadbalancer/scheduler.js');
const compileCommands = require('./compileCommands.js');

const exec = promisify(child.exec);
const queue = new ConcurrencyHandler();

// Stage One : Check State Of Container

const one = async (image, lang) => {
  const containerName = getContainer(lang);
  const cpus = cpuDistribution[lang];
  try {
    let output;
    try {
      output = await exec(`
        docker container inspect --format {{.State.Status}} ${containerName}
      `);
    } catch (err) {
      throw new Error('Container does not exist');
    }
    if (output.stdout.trim() !== 'running') {
      await exec(`
        docker container start ${containerName}
      `);
    }
    return containerName;
  } catch (err) {
    if (err.message === 'Container does not exist') {
      try {
        await exec(`
          docker container run --cpus ${cpus} -id --name ${containerName} ${image}
        `);
        return containerName;
      } catch (error) {
        throw new Error(`Error creating container ${containerName}`);
      }
    } else {
      if (err.stderr) {
        throw new Error(err.stderr);
      }
      throw err;
    }
  }
};

// Stage Two : Copy Source Code File In The Container

const two = async (lang, codeFile, containerName) => {
  let output;
  if (lang === 'java8') {
    output = '/main.java';
  } else {
    output = '/';
  }
  try {
    await exec(`docker cp ${codeFile} ${containerName}:${output}`);
  } catch (err) {
    if (err.stderr) {
      throw new Error(err.stderr);
    } else {
      throw err;
    }
  }
};

// Stage Three: Compile Source Code File (only for c/c++)

const three = async (lang, cfile, containerName) => {
  let codefile = cfile;
  codefile = codefile.replace(/\\/g, '/');
  codefile = codefile.split('/');
  const fileName = codefile[codefile.length - 1];
  let rawName = null;
  if (lang === 'c' || lang === 'cpp') {
    rawName = `${fileName.slice(0, fileName.indexOf('.'))}.out`;
  }
  const compileCommand = compileCommands[lang](containerName, fileName, rawName);
  try {
    await exec(compileCommand);
  } catch (err) {
    if (err.stderr) {
      throw new Error(err.stderr);
    } else {
      throw err;
    }
  }
};

// Stage Four: Execute Source Code

const four = (lang, cfile, testCaseFiles, command, containerName) => {
  let codefile = cfile;
  codefile = codefile.replace(/\\/g, '/');
  codefile = codefile.split('/');
  let filename = codefile[codefile.length - 1];
  if (lang === 'java8') {
    filename = 'main';
  } else if (lang === 'c' || lang === 'cpp') {
    filename = `${filename.slice(0, filename.indexOf('.'))}.out`;
  }
  let count = 0;
  let innerCb;
  const result = {};
  const pinger = () => new Promise((resolve) => {
    innerCb = () => {
      scheduler.next(containerName);
      count += 1;
      if (count === testCaseFiles.length) {
        resolve(result);
      }
    };
  });
  const asyncTask = (timeOutBar, testCaseFile, timeLimit) => {
    let timeOut;
    let runTimeDuration = 0;
    const testCaseStream = fs.createReadStream(testCaseFile);
    const cb = (err, stdout, stderr) => {
      clearTimeout(timeOut);
      runTimeDuration = (new Date()).getTime() - runTimeDuration;
      testCaseStream.unpipe();
      testCaseStream.destroy();
      if (err && err.signal !== 'SIGINT') {
        innerCb();
        result[testCaseFile] = {
          error: true,
          timeout: false,
          output: "Internal server error. Couldn't execute the program.",
        };
        return null;
      }
      if (stderr) {
        innerCb();
        result[testCaseFile] = {
          error: true,
          timeout: false,
          output: stderr.trim(),
        };
        return null;
      }
      if ((err && err.killed && err.signal === 'SIGINT')
        || parseFloat(runTimeDuration / 1000) > parseFloat(timeLimit)) {
        innerCb();
        result[testCaseFile] = {
          error: true,
          timeout: true,
          output: `TLE ${runTimeDuration / 1000}s`,
        };
        return null;
      }
      innerCb();
      result[testCaseFile] = { error: false, output: stdout.trim() };
      return null;
    };
    const childProcess = child.exec(`
      docker container exec -i ${containerName} ${command}${filename}
    `, cb);
    testCaseStream.pipe(childProcess.stdin);
    runTimeDuration = (new Date()).getTime();
    timeOut = getStageFourTimeout(childProcess, timeOutBar, queue);
  };
  for (let idx = 0; idx < testCaseFiles.length; idx += 1) {
    const testCaseFile = testCaseFiles[idx].file;
    const timeOutBar = parseFloat(testCaseFiles[idx].timeout) * 3000;
    const timeLimit = testCaseFiles[idx].timeout;
    const status = scheduler.schedule(
      asyncTask.bind(this, timeOutBar, testCaseFile, timeLimit), containerName,
    );
    if (!status) {
      result[testCaseFile] = { error: true, output: 'Error occured while scheduling' };
    }
  }
  return pinger();
};

module.exports = {
  one, two, three, four,
};

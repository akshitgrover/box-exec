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

const stage = require('./stage.js');
const dockerImage = require('./dockerimageLib.js');
const execCommands = require('./execCommands.js');

const handler = (emitter) => {
  const e = emitter;
  let containerName;
  switch (e.language) {
    case 'python2':
      stage.one(dockerImage.python2, 'python2')
        .then((cntName) => {
          containerName = cntName;
          return stage.two('python2', e.codefile, containerName);
        })
        .then(() => stage.four(
          'python2',
          e.codefile,
          e.testcasefiles,
          execCommands.python2,
          containerName,
        ))
        .then((data) => {
          e.output = data;
          e.emit('output', data);
        })
        .catch((error) => {
          e.error = true;
          e.errortext = error;
          e.emit('error', error.message);
        });
      break;

    case 'python3':
      stage.one(dockerImage.python3, 'python3')
        .then((cntName) => {
          containerName = cntName;
          return stage.two('python3', e.codefile, containerName);
        })
        .then(() => stage.four(
          'python3',
          e.codefile,
          e.testcasefiles,
          execCommands.python3,
          containerName,
        ))
        .then((data) => {
          e.output = data;
          e.emit('output', data);
        })
        .catch((error) => {
          e.error = true;
          e.errortext = error;
          e.emit('error', error.message);
        });
      break;

    case 'c':
      stage.one(dockerImage.c, 'c')
        .then((cntName) => {
          containerName = cntName;
          return stage.two('c', e.codefile, containerName);
        })
        .then(() => stage.three(
          'c',
          e.codefile,
          containerName,
        ))
        .then(() => stage.four(
          'c',
          e.codefile,
          e.testcasefiles,
          execCommands.c,
          containerName,
        ))
        .then((data) => {
          e.output = data;
          e.emit('output', data);
        })
        .catch((error) => {
          e.error = true;
          e.errortext = error;
          e.emit('error', error.message);
        });
      break;

    case 'cpp':
      stage.one(dockerImage.cpp, 'cpp')
        .then((cntName) => {
          containerName = cntName;
          return stage.two('cpp', e.codefile, containerName);
        })
        .then(() => stage.three('cpp', e.codefile, containerName))
        .then(() => stage.four(
          'cpp',
          e.codefile,
          e.testcasefiles,
          execCommands.cpp,
          containerName,
        ))
        .then((data) => {
          e.output = data;
          e.emit('output', data);
        })
        .catch((error) => {
          e.error = true;
          e.errortext = error;
          e.emit('error', error.message);
        });
      break;

    default: // empty
  }
};

module.exports = handler;

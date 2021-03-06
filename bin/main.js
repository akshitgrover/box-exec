#!/usr/bin/env node

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

const setup = require('./setup.js');
const gracefulSetup = require('./gracefulsetup.js');
const setContainers = require('./setupcontainers.js');
const setCPUs = require('./setupcpus.js');
const reset = require('./reset.js');
const configure = require('./configure.js');

const args = process.argv.slice(2);

switch (args[0].trim()) {
  case 'setup':
    if (args[1] && (args[1].trim() === '--graceful' || args[1].trim() === '-g')) {
      gracefulSetup();
      break;
    }
    setup();
    break;
  case 'set':
    if (args[1] && args[1].trim() === 'containers') {
      setContainers(args.slice(2));
    } else if (args[1] && args[1].trim() === 'cpus') {
      setCPUs(args.slice(2));
    }
    break;
  case 'reset':
    reset();
    break;
  case 'configure':
    configure();
    break;
  default:
    process.stderr.write(`Error: Invalid command '${args[0]}'\n`);
    break;
}

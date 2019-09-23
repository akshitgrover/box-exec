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

const getStageFourTimeout = (cp, timeOut) => setTimeout(() => cp.kill('SIGINT'), timeOut);

const killContainer = (containerName) => {
  child.exec(`docker container rm ${containerName} --force`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error killing container after TIMEOUT | ${containerName}`);
    }
    if (stderr) {
      console.error(stderr);
    }
  });
};

module.exports = { getStageFourTimeout, killContainer };

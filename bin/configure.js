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

const os = require('os');
const fs = require('fs');
const path = require('path');

const cpuDistribution = require('../config/.cpudist.json');
const containers = require('../config/.containers.json');

const numLanguages = Object.keys(containers).length;
const physicalCPUs = os.cpus().length;
const perLanguageCores = physicalCPUs / numLanguages;
const numContainersPerLanguage = Math.ceil(perLanguageCores);

module.exports = () => {
  Object.keys(cpuDistribution).forEach((lang) => {
    cpuDistribution[lang] = perLanguageCores;
    containers[lang] = numContainersPerLanguage;
  });
  fs.writeFileSync(
    path.join(__dirname, '../config/.cpudist.json'),
    `${JSON.stringify(cpuDistribution)}\n`,
  );
  fs.writeFileSync(
    path.join(__dirname, '../config/.containers.json'),
    `${JSON.stringify(containers)}\n`,
  );
  process.stdout.write('Successfully configured\n');
};

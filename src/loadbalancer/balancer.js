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

const availableSpots = {};
const lastScheduledOn = {};

const setup = () => {
  const containers = require('../../config/.containers.json');
  Object.keys(containers).forEach((lang) => {
    availableSpots[lang] = containers[lang];
    lastScheduledOn[lang] = 0;
  });
  try {
    fs.writeFileSync(
      path.join(__dirname, './config/.schedulings.json'),
      JSON.stringify(availableSpots),
    );
    fs.writeFileSync(
      path.join(__dirname, './config/.lastscheduling.json'),
      JSON.stringify(lastScheduledOn),
    );
  } catch (err) {
    return err.message;
  }
  return null;
}

const getContainer = (lang, stage) => {
  const toBeScheduledOn = (lastScheduledOn[lang] + 1) % availableSpots[lang];
  if (stage === 4) {
    lastScheduledOn[lang] += (lastScheduledOn[lang] + 1) % availableSpots[lang];
  }
  return `box-exec-${lang}-${toBeScheduledOn}`;
}

module.exports = {
  setup, getContainer,
}

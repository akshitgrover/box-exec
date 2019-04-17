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

const { setupQueueDirectory } = require('./scheduler.js');

let setupFlag = false;
const availableSpots = {};
const lastScheduledOn = {};

const setup = () => {
  let containers;
  try {
    containers = fs.readFileSync(path.join(__dirname, '../../config/.containers.json'));
    containers = JSON.parse(containers);
  } catch (err) {
    return err.message;
  }
  Object.keys(containers).forEach((lang) => {
    availableSpots[lang] = containers[lang];
    lastScheduledOn[lang] = 0;
  });
  try {
    fs.writeFileSync(
      path.join(__dirname, './config/.lastscheduling.json'),
      `${JSON.stringify(lastScheduledOn)}\n`,
    );
  } catch (err) {
    return err.message;
  }
  setupFlag = true;
  setupQueueDirectory(containers);
  return null;
};

const getContainer = (lang) => {
  lastScheduledOn[lang] = (lastScheduledOn[lang] + 1) % availableSpots[lang];
  return `box-exec-${lang}-${lastScheduledOn[lang]}`;
};

const status = () => setupFlag;

module.exports = {
  setup, getContainer, status,
};

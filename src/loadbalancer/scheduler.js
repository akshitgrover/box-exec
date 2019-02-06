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

const Queue = require('../concurrencyHandler.js');

const queueDirectory = new Map();
const scheduleLockQueue = new Set();
let lockInterval = null;

const destroyLockInterval = () => {
  clearInterval(lockInterval);
};

const scheduleLockQueueTasks = () => {
  scheduleLockQueue.forEach((obj) => {
    const { task, containerName } = obj;
    const queue = queueDirectory.get(containerName);
    queue.queuePush(task);
  });
};

const schedule = (task, containerName) => {
  try {
    const lock = fs.readFileSync(
      path.join(__dirname, '../../config/.schedule.lock'), { encoding: 'utf8' },
    ).trim();
    if (lock === 'true' && lockInterval === null) {
      lockInterval = setInterval(() => {
        const lockStatus = fs.readFileSync(
          path.join(__dirname, '../../config/.schedule.lock'),
          { encoding: 'utf8' },
        ).trim();
        if (lockStatus === 'false') {
          destroyLockInterval();
          scheduleLockQueueTasks();
        }
      }, 1000);
    }
    if (lock === 'true') {
      scheduleLockQueue.add({ task, containerName });
      return true;
    }
    const queue = queueDirectory.get(containerName);
    queue.queuePush(task);
    return true;
  } catch (err) {
    return false;
  }
};

const next = (containerName) => {
  const queue = queueDirectory.get(containerName);
  queue.queueNext();
};

const setupQueueDirectory = (containers) => {
  queueDirectory.clear();
  Object.keys(containers).forEach((lang) => {
    const containerNum = containers[lang];
    for (let i = 0; i < containerNum; i += 1) {
      const containerName = `box-exec-${lang}-${i}`;
      queueDirectory.set(containerName, new Queue());
    }
  });
};

module.exports = {
  schedule, next, setupQueueDirectory,
};

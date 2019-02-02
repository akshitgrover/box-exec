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

const Queue = require('../concurrencyHandler.js');

const queueDirectory = {
  c: new Queue(),
  cpp: new Queue(),
  python2: new Queue(),
  python3: new Queue(),
};

const schedule = (task, lang) => {
  const queue = queueDirectory[lang];
  queue.queuePush(task);
};

const next = (lang) => {
  const queue = queueDirectory[lang];
  queue.queueNext();
};

module.exports = {
  schedule, next,
};

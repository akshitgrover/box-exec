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

// Queue Class

class Queue {
  constructor(limit = 1) {
    this.concurrencyLimit = limit;
    this.running = 0;
    this.tasks = [];
  }

  queuePush(task) {
    this.tasks.push(task);
    if (this.running <= this.concurrencyLimit) {
      this.running += 1;
      this.tasks[0]();
      this.tasks.splice(0, 1);
    }
  }

  queueNext() {
    this.running -= 1;
    if (this.tasks.length > 0) {
      this.running += 1;
      this.tasks[0]();
      this.tasks.splice(0, 1);
    }
  }

  set concurrentTasksLimit(limit) {
    this.concurrencyLimit = limit;
  }
}

module.exports = Queue;

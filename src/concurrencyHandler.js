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

//Queue Class

class Queue{

    constructor(limit = 25){

        this.concurrencyLimit = limit;
        this.running = 0;
        this.tasks = [];

    }

    queuePush(task){

        this.tasks.push(task);
        if(this.running <= this.concurrencyLimit){
            this.running++;
            this.tasks[0]();
            this.tasks.splice(0, 1);
        }

    }

    queueNext(){

        this.running--;
        if(this.tasks.length > 0){
            this.running++;
            this.tasks[0]();
            this.tasks.splice(0, 1);
        }

    }

    set concurrentTasksLimit(limit){

        this.concurrencyLimit = limit;

    }

}

module.exports = Queue;
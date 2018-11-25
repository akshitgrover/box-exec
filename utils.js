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

let cpuDistribution = {"c":1, "cpp":1, "python2": 1, "python3": 1}
let configured = false;

module.exports = {

    getStageFourTimeout(cp, timeOut, queue) {
        return setTimeout(()=>{
            cp.kill("SIGINT");
            queue.queueNext();
        }, timeOut);
    },

    setCPUDistribution(obj){

        if(configured === true){
            throw new Error("CPU Distribution can only be configured at the startup");
        }
        let missing = [];
        let distribution = {};
        for(lang in cpuDistribution){
            if(!(lang in obj)){
                missing.push(lang);
            }
            distribution[lang] = obj[lang];
        }
        if(missing.length > 0){
            return missing;
        }
        configured = true;
        return null;

    },

    cpuDistribution

}
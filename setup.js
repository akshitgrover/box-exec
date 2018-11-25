#!/usr/bin/env node

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

const cp = require("child_process");

const imageObj = require("./dockerimage_lib.js");

const args = process.argv.slice(2);
const cpuDistribution = {c:1, cpp:1, python2:1, python3:1};

let lang = null;
for(let idx = 0; idx < args.length; idx++){
    if(args[idx].startsWith("--") && args[idx].slice(2) in cpuDistribution){
        lang = args[idx].slice(2);
    }
    else if(lang !== null){
        let flag;
        try {
            flag = parseFloat(args[idx]);
            if(flag < 0 || isNaN(flag)){
                throw new Error(`CPU should be > 0, Specified CPUS for ${lang} = ${args[idx]}`)
            }
        } catch(err){
            console.error(err);
            break;
        }
        cpuDistribution[lang] = flag;  
    }
}

for(let lang in cpuDistribution){
    let container_name = `box-exec-${lang}`;

    cp.exec(`docker container rm ${container_name} --force`, (error, stdout, stderr)=>{
        if(!stderr.match(/No such container/) && stderr.length > 0){
            console.log(stderr);
            throw new Error(stderr);
        }
        cb();
    });
}

let count = 0

var cb = ()=>{
    if(++count == 4){
        startContainers();
    }
}

var startContainers = ()=>{

    for(let lang in cpuDistribution){
        let container_name = `box-exec-${lang}`;
        let image = imageObj[lang];
        let cpus = cpuDistribution[lang];

        cp.exec(`docker container run -id --cpus ${cpus} --name ${container_name} ${image}`, (error, stdout, stderr)=>{
            let stderrSplit = stderr.split(" ");
            if(stderrSplit.indexOf("Conflict.") === -1 && stderr.length > 0){
                throw new Error(stderr);
            }
            console.log(`${container_name} container is running with CPUS = ${cpus}`);
        });
    }
}
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

const child = require("child_process");
const fs = require("fs");

const queue = new (require("./concurrencyHandler.js"))();
const { getStageFourTimeout } = require("./utils.js");

//Stage One : Check State Of Container

const one = (image,lang)=>{
	const container_name = "box-exec-" + lang;
	return new Promise((resolve,reject)=>{
		child.exec(`docker container inspect --format {{.State.Status}} ${container_name}`,(error,stdout,stderr)=>{
			if(stderr){
				child.exec(`docker container run --cpus 1 -id --name ${container_name} ${image}`,(errorf,stdoutf,stderrf)=>{
					if(errorf || stderrf){
						reject();
					}
					resolve();
				});
			}
			else if(stdout != "running\n"){
				child.exec(`docker container start ${container_name}`,(errorf,stdoutf,stderrf)=>{
					if(errorf || stderrf){
						reject();
					}
					resolve();
				});
			}
			else{
				resolve();
			}
		});
	});
}

//Stage Two : Copy Source Code File In The Container

const two = (lang,codefile)=>{
	const container_name = "box-exec-" + lang;
	return new Promise((resolve,reject)=>{
		child.exec(`docker cp ${codefile} ${container_name}:/`,(error,stdout,stderr)=>{
			if(error || stderr){
				reject(error || stderr);
			}
			resolve(stdout);
		});
	});
}

//Stage Three: Compile Source Code File (only for c/c++)

const three = (lang,codefile)=>{
	const container_name = "box-exec-" + lang;
	codefile = codefile.replace(/\\/g,"/");
	codefile = codefile.split("/");	
	const filename = codefile[codefile.length - 1];
	const raw_name = filename.slice(0,filename.indexOf(".")) + ".out";
	return new Promise((resolve,reject)=>{
		child.exec(`docker container exec ${container_name} g++ -o ${raw_name} ${filename}`,(error,stdout,stderr)=>{
			if(error){
				let idx = error.message.indexOf("\n");
				error = error.message.slice(idx,error.length);
				reject(error);
			}
			if(stderr){
				reject(stderr);
			}
			resolve(stdout);
		});
	});
}

//Stage Four: Execute Source Code

const four = (lang,codefile,testcasefiles,command)=>{
	const container_name = "box-exec-" + lang;
	codefile = codefile.replace(/\\/g,"/");
	codefile = codefile.split("/");
	let filename = codefile[codefile.length - 1];
	if(lang == "c" || lang == "cpp"){
		filename = filename.slice(0,filename.indexOf(".")) + ".out";
	}
	return new Promise((resolve,reject)=>{

		let result = {};

		let count = 0;
		let innerCb = ()=>{

			queue.queueNext();
			if(++count == testcasefiles.length){
				resolve(result);
			}

		}

		for(let idx = 0; idx < testcasefiles.length; idx++){
			testcasefile = testcasefiles[idx]["file"];
			timeOutBar = parseFloat(testcasefiles[idx]["timeout"]) * 3000;
			let asyncTask = ()=>{
				
				let timeOut;
				let runTimeDuration = 0;
				let testCaseStream = fs.createReadStream(testcasefile);
				let childProcess = child.exec(`docker container exec -i ${container_name} ${command}${filename}`,(error,stdout,stderr)=>{
					clearTimeout(timeOut);
					testCaseStream.unpipe();
					testCaseStream.destroy();
					if(error){
						innerCb();
						return result[testcasefile] = {error:true, timeout:false, output:"Internal server error. Couldn't execute the program."};
					}
					runTimeDuration = (new Date()).getTime() - runTimeDuration;
					if(stderr){
						innerCb();
						return result[testcasefile] = {error:true, timeout:false, output:stderr.trim()};
					}
					if(parseFloat(runTimeDuration / 1000) > parseFloat(testcasefiles[idx]["timeout"]) || childProcess.killed === true){
						innerCb();
						return result[testcasefile] = {error:true, timeout:true, output: `TLE ${runTimeDuration / 1000}s`};
					}
					innerCb();
					result[testcasefile] = {error:false, output:stdout.trim()};
				});
				testCaseStream.pipe(childProcess.stdin);
				runTimeDuration = (new Date()).getTime();
				timeOut = getStageFourTimeout(childProcess, timeOutBar, queue);

			}
			queue.queuePush(asyncTask);
		};
		
	});
}

module.exports = {
	one,
	two,
	three,
	four
}
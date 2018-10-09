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

//Stage One : Check State Of Container

const one = (image,lang)=>{
	const container_name = "box-exec-" + lang;
	return new Promise((resolve,reject)=>{
		child.exec("docker container inspect --format {{.State.Status}} " + container_name,(error,stdout,stderr)=>{
			if(stderr){
				child.exec("docker container run -id --name " + container_name + " " + image,(errorf,stdoutf,stderrf)=>{
					if(errorf || stderrf){
						reject();
					}
					resolve();
				});
			}
			else if(stdout != "running\n"){
				child.exec("docker container start " + container_name,(errorf,stdoutf,stderrf)=>{
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
		child.exec("docker cp " + codefile + " " + container_name + ":/",(error,stdout,stderr)=>{
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
		child.exec("docker container exec " + container_name + " g++ -o " + raw_name + " " + filename,(error,stdout,stderr)=>{
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

		testcasefiles.forEach((testcasefile)=>{

			let testCaseStream = fs.createReadStream(testcasefile);
			let childProcess = child.exec("docker container exec -i " + container_name + " " + command + filename,(error,stdout,stderr)=>{
				testCaseStream.unpipe();
				testCaseStream.destroy();
				if(error || stderr){
					reject(error || stderr);
				}
				if(stderr){
					reject(stderr);
				}
				resolve(stdout);
			});
			testCaseStream.pipe(childProcess.stdin);
		
		});
		
	});
}

module.exports = {
	one,
	two,
	three,
	four
}
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

const EventEmitter = require("events");
const fs = require("fs");

const handler = require("./processhandler.js");

class ExecEmitter extends EventEmitter{
	constructor(){
		super();
		this.error = false;
		this.output = null;
		this.errortext = null;
		this.language = null;
		this.codefile = null;
		this.testcasefiles = null;
	}
}

const langObj = require("./lang.js");

const checkFile = (filepath)=>{
	return fs.existsSync(filepath);
}

const checkLangugeValidity = (langKey)=>{
	return langObj.hasOwnProperty(langKey);
}

const getEmitter = ()=>{
	var emitter = new ExecEmitter();
	emitter.setData = function(langKey,codeFile,testCaseFiles){
		if(!checkLangugeValidity(langKey)){
			emitter.emit("langKeyError",new Error("Invalid Language"));
			return;
		}
		if(!checkFile(codeFile)){
			emitter.emit("fileError",new Error("Code File Does Not Exist"));
			return;
		}
		if(testCaseFiles.constructor !== Array){
			emitter.emit("formatError", new Error("testCaseFiles is not an array"));
			return;
		}
		for(let idx = 0; idx < testCaseFiles.length; idx++){
			obj = testCaseFiles[idx];
			if(!("file" in obj && "timeout" in obj)){
				emitter.emit("formatError",new Error("Invalid testcase array format\nMake sure array holds obejct with 'timeout' and 'file' properties [... {file:<fileName>, timeout:<time-in-seconds>}]"))
				break;
			}
			testCaseFile = obj["file"];
			if(!checkFile(testCaseFile)){
				emitter.emit("fileError",new Error("Test Case File Does Not Exist"));
				break;
			}
		};
		this.language = langObj[langKey];
		this.codefile = codeFile;
		this.testcasefiles = testCaseFiles;
		emitter.emit("success");
		return;
	}
	emitter.execute = function(){
		handler(emitter);
	}
	return emitter;
}

module.exports = getEmitter;

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
		this.testcasefile = null;
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
	emitter.setData = function(langKey,codeFile,testCaseFile){
		if(!checkLangugeValidity(langKey)){
			emitter.emit("langKeyError",new Error("Invalid Language"));
			return;
		}
		if(!checkFile(codeFile)){
			emitter.emit("fileError",new Error("Code File Does Not Exist"));
			return;
		}
		if(!checkFile(testCaseFile)){
			emitter.emit("fileError",new Error("Test Case File Does Not Exist"));
			return;
		}
		this.language = langObj[langKey];
		this.codefile = codeFile;
		this.testcasefile = testCaseFile;
		return;
	}
	emitter.execute = function(){
		handler(emitter);
	}
	return emitter;
}

module.exports = getEmitter;

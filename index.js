const EventEmitter = require("events");
const fs = require("fs");

class ExecEmitter extends EventEmitter{
	constructor(){
		super();
		this.error = false;
		this.output = null;
		this.errorText = null;
		this.language = null;
		this.codefile = null;
		this.testcasefile = null;
	}
}

const langObj = {1:"python2",2:"python3",3:"c",4:"c++"};

const checkFile = (filepath)=>{
	return fs.existsSync(filepath);
}

const checkLangugeValidity = (langKey)=>{
	return langObj.hasOwnProperty(langKey);
}

const getEmitter = ()=>{
	var emitter = new ExecEmitter();
	emitter.setData = function(langKey,codeFile,testCaseFile){
		if(!checkLangugeValidity(langkey)){
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
		this.language = langObj[langkey];
		this.codefile = codeFile;
		this.testcasefile = testCaseFile;
		return;
	}
	return emitter;
}

module.exports = getEmitter;

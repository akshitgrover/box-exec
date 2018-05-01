const boxExec = require("box-exec")();
const path = require("path");

const lang = 7;
const codefilepath = path.join(__dirname + "/source_code.py");
const testcasefilepath = path.join(__dirname + "/test_case.txt");

// Event To Check For Absence Of Code And TestCase File

boxExec.on("fileError",(err)=>{
	console.log(err);
});

// Event To Check For Validity Of Source Code Language

boxExec.on("langKeyError",(err)=>{
	console.log(err);
});

// Event When Data Is Set Successfully

boxExec.on("success",(data)=>{
	boxExec.execute();
});

// Function Call To Set Data

boxExec.setData(lang,codefilepath,testcasefilepath)


// Event To Check For Any Compilation Or Runtime Errors

boxExec.on("error",()=>{
	console.log(boxExec.errortext);
});

// Event To Get The Output Of Successfull Code Run

boxExec.on("output",()=>{
	console.log(boxExec.output);
});
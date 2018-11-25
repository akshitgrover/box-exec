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

const stage = require("./stage.js");
const lang_string = require("./lang.js");
const docker_image = require("./dockerimage_lib.js");
const exec_commands = require("./exec_commands.js");

const handler = (emitter)=>{
	
	switch(emitter.language){

		case "python2":

			stage.one(docker_image["python2"],"python2").then(()=>{

				return stage.two("python2",emitter.codefile);

			}).then((data)=>{

				return stage.four("python2",emitter.codefile,emitter.testcasefiles,exec_commands["python2"]);
			
			}).then((data)=>{

				emitter.output = data;
				emitter.emit("output", data);

			}).catch((error)=>{

				emitter.error = true;
				emitter.errortext = error;
				emitter.emit("error", error);

			});
			break;

		case "python3":

			stage.one(docker_image["python3"],"python3").then(()=>{

				return stage.two("python3",emitter.codefile);

			}).then((data)=>{

				return stage.four("python3",emitter.codefile,emitter.testcasefiles,exec_commands["python3"]);
			
			}).then((data)=>{

				emitter.output = data;
				emitter.emit("output", data);

			}).catch((error)=>{

				emitter.error = true;
				emitter.errortext = error;
				emitter.emit("error", error);

			});
			break;
		
		case "c":

			stage.one(docker_image["c"],"c").then(()=>{

				return stage.two("c",emitter.codefile);

			}).then((data)=>{

				return stage.three("c",emitter.codefile);

			}).then((data)=>{

				return stage.four("c",emitter.codefile,emitter.testcasefiles,exec_commands["c"]);

			}).then((data)=>{

				emitter.output = data;
				emitter.emit("output", data);

			}).catch((error)=>{

				emitter.error = true;
				emitter.errortext = error;
				emitter.emit("error", error);

			});
			break;
		
		case "cpp":

			stage.one(docker_image["cpp"],"cpp").then(()=>{

				return stage.two("cpp",emitter.codefile);

			}).then((data)=>{

				return stage.three("cpp",emitter.codefile);

			}).then((data)=>{

				return stage.four("cpp",emitter.codefile,emitter.testcasefiles,exec_commands["cpp"]);

			}).then((data)=>{

				emitter.output = data;
				emitter.emit("output", data);

			}).catch((error)=>{

				emitter.error = true;
				emitter.errortext = error;
				emitter.emit("error", error);

			});
			break;

		default:
			//empty

	}
}

module.exports = handler;
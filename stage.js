const child = require("child_process");


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
			else if(stdout != "running"){
				child.exec("docker container start " + container_name,(errorf,stdoutf,stderrf)=>{
					if(errorf || stderrf){
						reject();
					}
					resolve();
				});
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
				reject();
			}
			resolve();
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
				reject(error);
			}
			if(stderr){
				reject(stderr);
			}
			resolve(stdout);
		});
	});
}

module.exports = {
	one,
	two,
	three
}
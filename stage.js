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

module.exports = {
	one
}
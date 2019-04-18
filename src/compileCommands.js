module.exports = {
  c: containerName => `docker container exec ${containerName} g++ code.c`,
  cpp: containerName => `docker container exec ${containerName} g++ code.cpp`,
  java8: containerName => `docker container exec ${containerName} javac main.java`,
};

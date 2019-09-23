module.exports = {
  c: containerName => `docker container exec ${containerName} sh -c "g++ code.c"`,
  cpp: containerName => `docker container exec ${containerName} sh -c "g++ code.cpp"`,
  java8: containerName => `docker container exec ${containerName} sh -c "javac main.java"`,
};

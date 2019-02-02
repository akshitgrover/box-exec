module.exports = {
  c: (containerName, inputFile, outputFile) => `docker container exec ${containerName} g++ -o ${outputFile} ${inputFile}`,
  cpp: (containerName, inputFile, outputFile) => `docker container exec ${containerName} g++ -o ${outputFile} ${inputFile}`,
  java8: containerName => `docker container exec ${containerName} javac main.java`,
};

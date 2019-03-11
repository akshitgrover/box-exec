# Box Execute

[![Build Status](https://travis-ci.org/akshitgrover/box-exec.svg?branch=master)](https://travis-ci.org/akshitgrover/box-exec) [![npm 1.0.3](https://img.shields.io/badge/npm-1.0.3-blue.svg)](https://npmjs.org/package/box-exec) ![node >=6](https://img.shields.io/badge/node->=6-red.svg) [![dependencies null](https://img.shields.io/badge/dependencies-null-yellow.svg)](https://npmjs.org/package/box-exec) [![examples 5](https://img.shields.io/badge/examples-4-orange.svg)](https://github.com/akshitgrover/box-exec/tree/master/examples)

## What Is Box-Execute?

Box execute is an npm package to compile/run codes (c,cpp,python) in a virtualized environment, Here virtualized environment used is a docker container. This packages is built to ease the task of running a code against test cases as done by websites used to practice algorithmic coding.

## Using Box-Execute

* `npm i box-exec`
* [`Look For Examples`](https://github.com/akshitgrover/box-exec/tree/master/examples)

## Box-Execute Structure

Language supported by Box-Execute are:
* c
* cpp
* python 2
* python 3

**NOTE:** Language support is to be extended.

For each language supported a docker container is present in which all the codes are executed to get the output.

## Under the hood

Box-Execute utilises staging architecture in order to run a code an get the output.

* **Stage One:**

>Container for a particular language is checked for it's status and in case of container "absence" or "not 
running status" container is started or restarted based on the container status.

**NOTE:** This stage is executed in all conditions.

* **Stage Two**

>Source code file is copied in the running container.

**NOTE:** This stage is executed in all conditions.

* **Stage Three**

>This stage is only executed in case when source code file is "C" or "CPP" file. Used for compiling C/CPP code.

**NOTE:** This stage is executed only when source code file is in C/CPP

* **Stage Four**

>This is the final stage where code is executed to get the output. Streams are used to write data to STDIN.

**NOTE:** This stage is executed in all conditions.

## Future Work

* Update Error Return On Command Failure

* Extend Language Support

* Add CLI tool

* Explore For Erroneous Conditions

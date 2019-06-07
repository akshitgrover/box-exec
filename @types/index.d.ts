/// <reference types="node" />

import * as Emitter from 'events';

/*
  Structure of [BoxExec Instance].output
*/
interface Output {
  readonly error: boolean;
  readonly timeout: boolean;
  readonly output: string;
}

/*
  TestCase object structure.

  Passed in [BoxExec Instance].setData();
*/
interface TestCase {
  file: string;
  timeout: number;
}

/*
  BoxExec emitter class

  User facing interface
*/
declare class ExecEmitter extends Emitter{

  // Readonly instance variables
  readonly error: boolean;
  readonly errortext: Error | null;
  readonly output: Output | null;

  // Configurable variables
  private language: string | null;
  private codefile: string | null;
  private testcasefiles: string | null;

  // Configurartion member functions
  setData(x: number, y: string, z: TestCase[]): void;
  execute(): void;
}

/*
  ExecEmitter constructor function
*/
declare function getEmitter(): ExecEmitter;

/*
  Proxy namespace for ES6 imports
*/
declare namespace getEmitter { }

export = getEmitter;

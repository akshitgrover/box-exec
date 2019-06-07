/// <reference types="node" />

import * as Emitter from 'events';

/*
  ExecEmitter constructor function
*/
declare function getEmitter(): getEmitter.ExecEmitter;

/*
  Proxy namespace for ES6 imports
*/
declare namespace getEmitter {

  /*
    BoxExec emitter class

    User facing interface
  */
  class ExecEmitter extends Emitter{

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
    Structure of [BoxExec Instance].output
  */
  export interface Output {
    readonly error: boolean;
    readonly timeout: boolean;
    readonly output: string;
  }

  /*
    TestCase object structure.

    Passed in [BoxExec Instance].setData();
  */
  export interface TestCase {
    file: string;
    timeout: number;
  }

}

export = getEmitter;

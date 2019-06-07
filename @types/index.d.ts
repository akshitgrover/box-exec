/// <reference types="node" />

import * as Emitter from 'events';

/*
  Structure of [BoxExec Instance].output
*/
interface Output {
  readonly error: bool;
  readonly timeout: bool;
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

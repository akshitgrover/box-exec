/// <reference types="node" />

import * as Emitter from 'events';

/*
  Structure of [BoxExec Instance].output
*/
interface output {
  readonly error: bool;
  readonly timeout: bool;
  readonly output: string;
}

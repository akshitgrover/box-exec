# Changelog

Refer this file to check out for updates in latest releases.

## [v2.0.0](https://npmjs.org/package/box-exex) | 26-11-2018 |

* Added testcase timeout support
  > **Testcases are now passed as array fo objects: [... {file:<filename>, timeout: <timeout in seconds>}]**
  
  > If a testcase execution takes more then the timeout a TLE error {error:true, timeout:true, output: "TLE <execution time> is returned"}

* Added timeout checker
  > **Process handler now kills a process with run-time > 3 * testCase timeout**

* Added support to configure CPU per container
  > **Now, It is possible to allocate number of cores to a container, Efficient load distribution**

* Added setup binary
  > **Setting up containers is now possible by executing binary ./node_modules/.bin/setup-boxexec**

## [v1.0.5](https://npmjs.org/package/box-exec/v/1.0.5) | 12-10-2018 |

Note: This is a bug fix release
* Refactor execution output to support multiple test case files.
  > Returns object:
  
  > Key: testcase file path string.
  
  > Value: {error: boolean, output: string} 

## [v1.0.4](https://npmjs.org/package/box-exec/v/1.0.4) | 10-10-2018 |

* Added multipe test case files support.
  > **Pass file paths as seperate arguments (like variadic parameters)**
  
  Refer an example: [Example](https://github.com/akshitgrover/box-exec/blob/ab610bcc3b888f7438fc39e2a03dbf1ea7e72857/tests/script.js#L16)

* Added concurrency control handler
  > **Limiting only to 25 test case execution concurrently (by default)**.

  Check it out: [File](https://github.com/akshitgrover/box-exec/blob/master/concurrencyHandler.js)

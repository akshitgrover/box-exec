const path = require('path');

const expect = require('expect');
const { it } = require('mocha');

const index = require('./../index.js');

it('Should Compile/Execute C Code', (done) => {
  const boxExec = index();
  boxExec.on('output', () => {
    expect(boxExec.output[path.join(`${__dirname}/case.txt`)].output).toBe('791116182579111618257911161825791116182572');
    done();
  });
  boxExec.on('formatError', (err) => {
    done(err);
  });
  boxExec.on('error', () => {
    done(boxExec.errortext);
  });
  boxExec.on('success', () => {
    boxExec.execute();
  });
  boxExec.setData('11', path.join(`${__dirname}/test_code.c`), [{ file: path.join(`${__dirname}/case.txt`), timeout: 2 }, { file: path.join(`${__dirname}/case.txt`), timeout: 2 }]);
});

it('Should Compile/Execute C++ Code', (done) => {
  const boxExec = index();
  boxExec.on('output', () => {
    expect(boxExec.output[path.join(`${__dirname}/case.txt`)].output).toBe('791116182579111618257911161825791116182572');
    done();
  });
  boxExec.on('error', () => {
    done(boxExec.errortext);
  });
  boxExec.on('success', () => {
    boxExec.execute();
  });
  boxExec.setData('16', path.join(`${__dirname}/test_code.cpp`), [{ file: path.join(`${__dirname}/case.txt`), timeout: 2 }, { file: path.join(`${__dirname}/case.txt`), timeout: 2 }]);
});

it('Should Compile/Execute python3 Code', (done) => {
  const boxExec = index();
  boxExec.on('output', () => {
    expect(boxExec.output[path.join(`${__dirname}/case.txt`)].output).toBe('7\n9\n11\n16\n18\n25\n7\n9\n11\n16\n18\n25\n7\n9\n11\n16\n18\n25\n7\n9\n11\n16\n18\n25\n72');
    done();
  });
  boxExec.on('error', () => {
    done(boxExec.errortext);
  });
  boxExec.on('success', () => {
    boxExec.execute();
  });
  boxExec.setData('9', path.join(`${__dirname}/test_code_3.py`), [{ file: path.join(`${__dirname}/case.txt`), timeout: 2 }, { file: path.join(`${__dirname}/case.txt`), timeout: 2 }]);
});

it('Should Compile/Execute python2 Code', (done) => {
  const boxExec = index();
  boxExec.on('output', () => {
    expect(boxExec.output[path.join(`${__dirname}/case.txt`)].output).toBe('7\n9\n11\n16\n18\n25\n7\n9\n11\n16\n18\n25\n7\n9\n11\n16\n18\n25\n7\n9\n11\n16\n18\n25\n72');
    done();
  });
  boxExec.on('error', () => {
    done(boxExec.errortext);
  });
  boxExec.on('success', () => {
    boxExec.execute();
  });
  boxExec.setData('7', path.join(`${__dirname}/test_code.py`), [{ file: path.join(`${__dirname}/case.txt`), timeout: 2 }, { file: path.join(`${__dirname}/case.txt`), timeout: 2 }]);
});

const path = require('path');
const child = require('child_process');

const expect = require('expect');
const { it, after } = require('mocha');

const index = require('./../src/index.js');

after(() => {
  child.exec('docker container rm $(docker container ls -aq) -f', (err, stdout, stderr) => {
    const e = err || stderr;
    if (e !== undefined || e !== null) {
      console.error(e);
    }
  });
});

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
  boxExec.setData('11', path.join(`${__dirname}/test_code.c`), [{ file: path.join(`${__dirname}/case.txt`), timeout: 2 }, { file: path.join(`${__dirname}/tc.txt`), timeout: 2 }]);
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

it('Should Compile/Execute java8 code', (done) => {
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
  boxExec.setData('25', path.join(`${__dirname}/test_code.java`), [{ file: path.join(`${__dirname}/case.txt`), timeout: 2 }, { file: path.join(`${__dirname}/case.txt`), timeout: 2 }]);
});

it('Should Report TLE', (done) => {
  const boxExec = index();
  boxExec.on('output', () => {
    if (boxExec.output[path.join(`${__dirname}/case.txt`)].output.startsWith('TLE')) {
      done();
      return;
    }
    done(new Error('Process not killed'));
  });
  boxExec.on('error', () => {
    done(boxExec.errortext);
  });
  boxExec.on('success', () => {
    boxExec.execute();
  });
  boxExec.setData('11', `${__dirname}/test_inf_code.c`, [{ file: `${__dirname}/case.txt`, timeout: 2 }]);
});

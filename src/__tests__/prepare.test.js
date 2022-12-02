const path = require('path');
const {promisify} = require('util');
const rimrafOrig = require('rimraf');
const ncpModule = require('ncp');
const {readFile, access} = require('fs').promises;
const {WritableStreamBuffer} = require('stream-buffers');
const prepare = require('../prepare');

const rimraf = promisify(rimrafOrig);
const ncp = promisify(ncpModule.ncp);

const cwd = path.resolve(__dirname, './fixtures/temp');
const context = {
  nextRelease: {version: '1.2.0'},
  cwd,
  logger: {
    log: (...args) => {
      console.log(args);
    }
  },
  stdout: new WritableStreamBuffer(),
  stderr: new WritableStreamBuffer(),
};

const cleanUp = () => rimraf(cwd);

beforeEach(async () => {
  await cleanUp();
  await ncp(path.resolve(__dirname, './fixtures/valid'), cwd);
});

afterEach(async () => {
  await cleanUp();
});

const expectFileExists = file => expect(access(path.resolve(cwd, file))).resolves.toBeUndefined();

it('writes the new version to the haxelib.json file', async () => {
  await prepare({}, context);

  const versionContents = await readFile(path.resolve(cwd, 'haxelib.json'), 'utf8');
  expect(versionContents).toEqual(
    `{
  "name": "valid_lib",
  "license": "MIT",
  "tags": [],
  "classPath": "src/__tests__/fixtures/valid",
  "contributors": [
    "vantreeseba"
  ],
  "releasenote": "Release version 1.2.0. See CHANGELOG.md for details.",
  "version": "1.2.0",
  "url": "https://github.com/vantreeseba/semantic-release-haxelib/",
  "dependencies": {}
}`);
});

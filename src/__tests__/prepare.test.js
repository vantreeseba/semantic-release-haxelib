const path = require('path');
const {promisify} = require('util');
const rimrafOrig = require('rimraf');
const ncpModule = require('ncp');
const {readFile, writeFile, access} = require('fs').promises;
const {WritableStreamBuffer} = require('stream-buffers');
const prepare = require('../prepare');

const rimraf = promisify(rimrafOrig);
const ncp = promisify(ncpModule.ncp);

const cwd = path.resolve(__dirname, './fixtures/temp');
const gemspec = 'test-gem.gemspec';
const gemName = 'a-test-gem';
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

it('writes the new version to the version.rb file', async () => {
  await prepare({}, context, {gemspec, gemName});

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

// it('builds the gem', async() => {
//   const { gemFile } = await prepare({}, context, { versionFile, gemspec, gemName });
//
//   expect(gemFile).toEqual('a-test-gem-1.2.0.gem');
//   await expectFileExists(gemFile);
// });
//
// describe('when gemFileDir is set', () => {
//   it('builds the gem in the provided dir', async() => {
//     const { gemFile } = await prepare({ gemFileDir: 'some_dir' }, context, {
//       versionFile,
//       gemspec,
//       gemName,
//     });
//
//     expect(gemFile).toEqual('some_dir/a-test-gem-1.2.0.gem');
//     await expectFileExists(gemFile);
//   });
// });

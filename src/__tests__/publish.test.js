const fs = require('fs');
const path = require('path');
const {WritableStreamBuffer} = require('stream-buffers');
const publish = require('../publish');
const AdmZip = require('adm-zip');

const cwd = path.resolve(__dirname, './fixtures/temp');
const context = {
  env: {
    HAXELIB_PASS: '123',
  },
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

it('publishes the haxelib.', async () => {
  const libInfo = {};
  const cwd = path.resolve(__dirname, './fixtures/valid');
  const zip = path.resolve(cwd, 'test.zip');

  var createdZip = new AdmZip();
  createdZip.addFile('test.txt', Buffer.from('test'));
  createdZip.writeZip(zip);

  //   fs.writeFileSync(zip, 'this is not really a zip')

  await publish({haxelibPublish: true}, context, {libInfo, zip});

  //   const versionContents = await readFile(path.resolve(cwd, 'haxelib.json'), 'utf8');
  //   expect(versionContents).toEqual(
  //     `{
  //   "name": "valid_lib",
  //   "license": "MIT",
  //   "tags": [],
  //   "classPath": "src/__tests__/fixtures/valid",
  //   "contributors": [
  //     "vantreeseba"
  //   ],
  //   "releasenote": "Release version 1.2.0. See CHANGELOG.md for details.",
  //   "version": "1.2.0",
  //   "url": "https://github.com/vantreeseba/semantic-release-haxelib/",
  //   "dependencies": {}
  // }`);
});

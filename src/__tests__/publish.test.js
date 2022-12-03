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


// it('publishes the haxelib.', async () => {
//   const haxelibPublish = true;
//   const libInfo = {};
//   const cwd = path.resolve(__dirname, './fixtures/valid');
//   const zip = path.resolve(cwd, 'test.zip');
//
//   var createdZip = new AdmZip();
//   createdZip.addFile('test.txt', Buffer.from('test'));
//   createdZip.writeZip(zip);
//
//   await publish({haxelibPublish}, context, {libInfo, zip});
// });

it('fails when no zip path is provided.', async () => {
  const haxelibPublish = true;
  const libInfo = {};

  await expect(publish({haxelibPublish}, context, {libInfo, zip: ''}))
    .rejects.toEqual("Error: zip file '' does not exist.");
});

it('fails when invalid zip path is provided.', async () => {
  const haxelibPublish = true;
  const libInfo = {};

  await expect(publish({haxelibPublish}, context, {libInfo, zip: 'test.zip'}))
    .rejects.toEqual("Error: zip file 'test.zip' does not exist.");
});


it('fails when no password is provided.', async () => {
  const haxelibPublish = true;
  const libInfo = {};
  const cwd = path.resolve(__dirname, './fixtures/valid');
  const zip = path.resolve(cwd, 'test.zip');

  var createdZip = new AdmZip();
  createdZip.addFile('test.txt', Buffer.from('test'));
  createdZip.writeZip(zip);

  context.env.HAXELIB_PASS = '';

  await expect(publish({haxelibPublish}, context, {libInfo, zip}))
    .rejects.toEqual("Error: No password provided.");
});

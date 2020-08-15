// const tempy = require('tempy');
const haxelibVerify = require('./verifyConditions');
const haxelibPrepare = require('./prepare');
const haxelibPublish = require('./publish');

// const credentialsFile = tempy.file({ name: 'gem_credentials' });

// let gemName;
// let gemspec;
// let versionFile;
// let gemFile;

let name;
let version;
let classPath;


async function verifyConditions(pluginConfig, context) {
  ({ name, version, classPath } = await haxelibVerify(pluginConfig, context, { credentialsFile }));
}

async function prepare(pluginConfig, context) {
  // ({ gemFile } = await haxelibPrepare(pluginConfig, context, { versionFile, gemspec, gemName }));
}

async function publish(pluginConfig, context) {
  // await haxelibPublish(pluginConfig, context, { gemFile, gemName, credentialsFile });
}

module.exports = { verifyConditions, prepare, publish };

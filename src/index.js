const haxelibVerify = require('./verifyConditions');
const haxelibPrepare = require('./prepare');
const haxelibPublish = require('./publish');

let libInfo;
let zip;

async function verifyConditions(pluginConfig, context) {
  await haxelibVerify(pluginConfig, context, {});
}

async function prepare(pluginConfig, context) {
  ({ libInfo, zip } = await haxelibPrepare(pluginConfig, context, {}));
}

async function publish(pluginConfig, context) {
  await haxelibPublish(pluginConfig, context, { libInfo, zip });
}

module.exports = { verifyConditions, prepare, publish };

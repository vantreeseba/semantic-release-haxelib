// const path = require('path');
// const { writeFile, readFile } = require('fs').promises;
// const SemanticReleaseError = require('@semantic-release/error');
const glob = require('glob').promises;


const loadHaxelibJson = async ({ cwd, logger }) => {
  const libInfo = await glob('haxelib.json', { cwd });

  const parsedInfo = JSON.parse(libInfo);
  const { version, name, classPath } = parsedInfo;

  logger.log(`zipping everything in ${classPath} for lib.`);
  logger.log(`Publishing ${name}@${version} to haxelib registry`);
  return { name, version };
};

/**
 * Called by semantic-release during the verification step
 * @param {*} pluginConfig The semantic-release plugin config
 * @param {*} context The context provided by semantic-release
 */
module.exports = async function verify(pluginConfig, args) {
  // - Verify ruby installed?

  // - Locate gemspec and determine name
  const { name, version } = await loadHaxelibJson(args);

  // - Locate version file
  // const versionFile = await verifyVersionFile(cwd);

  // - Verify env var
  // await verifyApiKey({ env, cwd, credentialsFile });

  return { name, version };
};

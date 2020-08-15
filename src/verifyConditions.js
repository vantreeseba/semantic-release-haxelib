const path = require('path');
const { readFile } = require('fs').promises;
const SemanticReleaseError = require('@semantic-release/error');

const loadHaxelibJson = async(context) => {
  const {
    cwd,
    logger
  } = context;
  const file = path.join(cwd, './haxelib.json');
  let libInfo;

  try {
    libInfo = await readFile(file);
  } catch (err) {
    throw new SemanticReleaseError(
      'Couldn\'t find a `haxelib.json` file.',
      'ENOHAXELIBJSON',
      'A single [haxelib.json](https://lib.haxe.org/documentation/creating-a-haxelib-package/) file in the root of your project is required to release a haxelib package.'
    );
  }

  const parsedInfo = JSON.parse(libInfo);
  const { version, name, classPath } = parsedInfo;

  logger.log(`zipping everything in ${classPath} for lib.`);
  logger.log(`Publishing ${name}@${version} to haxelib registry`);

  return { name, version, classPath };
};

const verifyApiKey = async(context) => {
  const { env } = context;

  // TODO: Handle credentials stored in ~/.gem/credentials
  if (!env.HAXELIB_PASS) {
    throw new SemanticReleaseError(
      'No haxelib pass given.',
      'ENOHAXELIBPASS',
      'A haxelib password must set in the `HAXELIB_PASS` environment variable on you CI environment.'
    );
  }
};

/**
 * Called by semantic-release during the verification step
 * @param {*} pluginConfig The semantic-release plugin config
 * @param {*} context The context provided by semantic-release
 */
module.exports = async function verify(pluginConfig, context) {
  // - Verify ruby installed?

  // - Locate gemspec and determine name
  const { name, version, classPath } = await loadHaxelibJson(context);

  // - Verify env var
  await verifyApiKey(context);

  return { name, version, classPath };
};

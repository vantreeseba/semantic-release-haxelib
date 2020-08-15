const { unlink } = require('fs').promises;
const execa = require('execa');

module.exports = async function publish(
  { haxelibPublish = false },
  { cwd, env, logger, nextRelease: { version }, stdout, stderr },
  { libInfo, zip },
) {

  if (haxelibPublish !== false) {
    logger.log(`Publishing version ${version} to haxelib`);
    const args = ['submit', zip, env.HAXELIB_PASS, '--always'];

    const pushResult = execa('haxelib', args, { cwd, env });
    pushResult.stdout.pipe(stdout, { end: false });
    pushResult.stderr.pipe(stderr, { end: false });
    await pushResult;

    logger.log(`Published version ${version} of ${libInfo.name} to haxelib`);
  } else {
    logger.log(`Skip publishing to haxelib because haxelibPublish is ${haxelibPublish !== false}`);
  }

  await unlink(zip);
};

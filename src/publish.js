const {promisify} = require('util');
const {unlink, stat} = require('fs').promises;
const exec = promisify(require('child_process').exec);

module.exports = async function publish(
  {haxelibPublish = false},
  {cwd, env, logger, nextRelease: {version}, stdout, stderr},
  {libInfo, zip},
) {
  if (haxelibPublish !== false) {
    logger.log(`Publishing version ${version} to haxelib`);

    try {
      const res = await stat(zip);
    } catch (err) {
      throw (`Error: zip file '${zip}' does not exist.`);
    }

    if (!env.HAXELIB_PASS) {
      throw (`Error: No password provided.`);
    }

    logger.log(`Publishing ${zip} as ${version} to haxelib`);
    logger.log(`${env} ${cwd}`);

    try {
      // Put pass in quotes to prevent some issues in shells.
      const args = ['haxelib', 'submit', zip, `'${env.HAXELIB_PASS}'`, '--always'];
      const pushResult = await exec(args.join(' '), {env, cwd});
      process.stdout.write(pushResult.stdout);
    } catch (err) {
      process.stderr.write(err.toString());
    }

    logger.log(`Published version ${version} of ${libInfo.name} to haxelib`);
  } else {
    logger.log(`Skip publishing to haxelib because haxelibPublish is ${haxelibPublish !== false}`);
  }

  await unlink(zip);
};

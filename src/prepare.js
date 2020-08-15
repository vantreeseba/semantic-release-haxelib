const { readFile, writeFile } = require('fs').promises;
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const writeVersion = async ({ nextVersion, logger, cwd }) => {
  const jsonPath = path.resolve(cwd, 'haxelib.json');
  const contents = await readFile(jsonPath);
  const json = JSON.parse(contents);
  json.version = nextVersion;
  await writeFile(jsonPath, JSON.stringify(json, null, 2));

  logger.log(`Writing version ${nextVersion} to ${jsonPath}`);

  return json;
};

const buildZip = async ({ cwd, additionalFiles, artifactsDir, libInfo, logger }) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir);
    }

    // create a file to stream archive data to.
    var zipFilePath = path.resolve(artifactsDir, `${libInfo.name}.zip`);
    logger.log(`Creating zip for haxelib at ${zipFilePath}`);
    var output = fs.createWriteStream(zipFilePath);
    var archive = archiver('zip', {
      zlib: { level: 5 } // Sets the compression level.
    });

    const complete = () => {
      logger.log(`Wrote zip for haxelib at ${zipFilePath}`);
      resolve(zipFilePath);
    };
    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', complete);

    // good practice to catch this error explicitly
    archive.on('warning', function(warning) {
      console.log('warning', warning);
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      reject(err);
    });

    // pipe archive data to the file
    archive.pipe(output);

    // append files from a glob pattern
    archive.glob(`${libInfo.classPath}/**/*`);

    additionalFiles.forEach(file => {
      const filePath = path.resolve(cwd, file);
      archive.append(filePath, { name: filePath });
    });

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method
    // so register to them beforehand
    archive.finalize();
  });
};

module.exports = async function prepare(
  { artifactsDir = 'artifacts', additionalFiles },
  { nextRelease: { version }, cwd, logger }
) {
  const libInfo = await writeVersion({ nextVersion: version, logger, cwd });
  const zip = await buildZip({ cwd, additionalFiles, artifactsDir, libInfo, logger });

  return { libInfo, zip };
};

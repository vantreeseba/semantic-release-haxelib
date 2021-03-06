const { readFile, writeFile } = require('fs').promises;
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const writeVersion = async({ nextVersion, logger, cwd }) => {
  const jsonPath = path.resolve(cwd, 'haxelib.json');
  const contents = await readFile(jsonPath, 'utf8');
  const json = JSON.parse(contents);
  json.version = nextVersion;
  await writeFile(jsonPath, JSON.stringify(json, null, 2));

  logger.log(`Writing version ${nextVersion} to ${jsonPath}`);

  return json;
};

const writeReleaseNote = async({ nextVersion, logger, cwd }) => {
  const jsonPath = path.resolve(cwd, 'haxelib.json');
  const contents = await readFile(jsonPath, 'utf8');
  const json = JSON.parse(contents);
  json.releasenote = `Release version ${nextVersion}. See CHANGELOG.md for details.`;
  await writeFile(jsonPath, JSON.stringify(json, null, 2));

  logger.log(`Writing releaseNote ${json.releasenote} to ${jsonPath}`);

  return json;
};

const buildZip = async({ cwd, additionalFiles, artifactsDir, libInfo, logger }) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir);
    }

    // create a file to stream archive data to.
    var zipFilePath = artifactsDir + `/${libInfo.name}.zip`;
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
      const filePath = `${file}`;

      if(!fs.existsSync(filePath)) {
        return;
      }

      archive.append(fs.createReadStream(filePath), { name: filePath });
    });

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method
    // so register to them beforehand
    archive.finalize();
  });
};

module.exports = async function prepare(
  { artifactsDir = 'artifacts', additionalFiles = [] },
  { nextRelease: { version }, cwd, logger }
) {
  let libInfo = await writeVersion({ nextVersion: version, logger, cwd });
  libInfo = await writeReleaseNote({ nextVersion: version, logger, cwd });


  // Add default files to additional files.
  additionalFiles.push('haxelib.json');
  additionalFiles.push('README.md');
  additionalFiles.push('CHANGELOG.md');
  additionalFiles.push('LICENSE.md');

  // Make sure all files are unique.
  additionalFiles = additionalFiles.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  const zip = await buildZip({ cwd, additionalFiles, artifactsDir, libInfo, logger });

  return { libInfo, zip };
};

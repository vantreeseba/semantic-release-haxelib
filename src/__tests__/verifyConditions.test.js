const path = require('path');
const SemanticReleaseError = require('@semantic-release/error');
const verifyConditions = require('../verifyConditions');

const defaultEnv = { HAXELIB_PASS: '123' };
const validCwd = path.resolve(__dirname, './fixtures/valid');

it('finds and loads the haxelib.json', async() => {
  const { name, version, classPath } = await verifyConditions(
    {},
    { cwd: validCwd, env: defaultEnv, logger: { log: () => {} } },
  );
  expect(name).toEqual('valid_lib');
  expect(version).toEqual('0.1.0');
  expect(classPath).toEqual('src/__tests__/fixtures/valid');
});

describe('when there is no haxelib.json', () => {
  it('throws an error', async() => {
    await expect(
      verifyConditions({}, {
        cwd: process.cwd(),
        env: defaultEnv,
        logger: { log: () => {} }
      }),
    ).rejects.toThrow(new SemanticReleaseError('Couldn\'t find a `haxelib.json` file.'));
  });
});

describe('when the haxelib password env var is not defined', () => {
  it('throws an error', async() => {
    await expect(
      verifyConditions({}, {
        cwd: validCwd,
        env: {},
        logger: { log: () => {} }
      }),
    ).rejects.toThrow(/^No haxelib pass given.$/);
  });
});

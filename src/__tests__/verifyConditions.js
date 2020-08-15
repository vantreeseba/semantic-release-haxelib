const path = require('path');
const tempy = require('tempy');
// const { readFile } = require('fs').promises;
const SemanticReleaseError = require('@semantic-release/error');
const verifyConditions = require('../verifyConditions');

const defaultEnv = { GEM_HOST_API_KEY: '123' };
const validCwd = path.resolve(__dirname, './fixtures/valid');
let credentialsFile;

beforeEach(() => {
  credentialsFile = tempy.file();
});

it('finds and loads the gemspec', async () => {
  const { gemName, gemspec } = await verifyConditions(
    {},
    { cwd: validCwd, env: defaultEnv },
    { credentialsFile },
  );
  expect(gemName).toEqual('a-test-gem');
  expect(gemspec).toEqual('test-gem.gemspec');
});

describe('when there is no gemfile', () => {
  it('throws an error', async () => {
    await expect(
      verifyConditions({}, { cwd: process.cwd(), env: defaultEnv }, { credentialsFile }),
    ).rejects.toThrow(new SemanticReleaseError("Couldn't find a `.gemspec` file."));
  });
});

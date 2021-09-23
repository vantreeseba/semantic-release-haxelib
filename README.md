# semantic-release-haxelib

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin for publishing Haxe [libraries](https://lib.haxe.org/).

| Step               | Description                                                                                                                                   |                                                                     |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `verifyConditions` | Locate and validate a `haxelib.json` file, verify the presence of the `HAXELIB_PASS` environment variable. |                                                                     |
| `prepare`          | Update the version in the `haxelib.json` version file and zip the files in classpath.                                      |                                                                     |
| `publish`          | [Submit the Zip](https://lib.haxe.org/documentation/using-haxelib/#submit) to the haxelib package manager.                                                                |                                                                     |

## Install

```bash
$ npm install semantic-release-haxelib -D
```

## Usage

Add the plugin to the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "semantic-release-haxelib"
  ]
}
```

## Configuration

### Haxelib  

The haxelib server authentication configuration is **required**.

The password must be set using the `HAXELIB_PASS` environment variable.

### haxelib.json file

This plugin requires exactly one valid `haxelib.json` file to be present in the CWD.

### Options

| Options      | Description                                                                                                         | Default                                                                                                                          |
|--------------|---------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `haxelibPublish` | Whether to publish your haxelib to the haxelib server. | `true` |
| `additionalFiles` | Additional files to add to haxelib archive (i.e. CHANGELOG.md) | [] |

The files added to the zip by default are
* haxelib.json
* README.md
* LICENSE.md
* CHANGELOG.md

as well as everything recursively under the classPath in the haxelib.json.

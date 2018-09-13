# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v2.0.0] - 2018-09-XX

TODO: fix date ^

A major re-write in TypeScript along with migrating to Jest and Stryker

Removed `pre-commit`
  - Reduces friction for small commits

Removed webpack build
  - As we now export for `commonjs` and `es6` modules directly
    - the `es6` does not have CLI support - designed for use with Node and browsers

- Uniform errors


- Use [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) format for `CHANGELOG.md`
- Added an [AUTHORS](AUTHORS) file to provide greater transparency and recognition for future contributors
- Updated `devDependencies`
- Uses [`npm audit`](http://docs.npmjs.com/getting-started/running-a-security-audit) for checking security vulnerabilities; replacing [``]()
- Added new specs to support a wider-range of use cases: **1c**, **1d**, **2a**, **2b**, **2c**, **2d**
- Fixed a bug that allowed a Bronze instance's `pid` and `sequence` properties to be set with negative integers, which then produced unique, yet invalid ids
- Fixed a bug that allowed negative integers for `pid`, `sequence`, and `timestamp` when parsing an id
- Added test support for Node 8, 10, and LTS releases
- Added comments throughout the codebase to make things easier to reason about
- Greatly improved test performance
  - CLI tests primarily make use of `./lib/cli.js` as a module rather than creating many child processes
- Documentation updates:
  - Make use of `docs/` to keep `README.md` concise
  - TODO: added a few examples
    - TODO: [creating users on a distributed network](TODO: link)
    - TODO: [user photo upload](TODO: link) TODO: Cat2
    - TODO: [ETag use case](TODO: link)
      - TODO: move to example: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
  - Added logo
  - Updated `CHANGELOG.md` format
  - Updated `CONTRIBUTING.md` to streamline future contributions
- CLI updates:
  - Added `--json`, `--parse`, and `--stringify` options
  - Refactored `./lib/cli.js` to make things a bit easier to reason about
  - Improved performance when using many command-line args
  - Improved reliability when reading from a sequence file that is not a safe integer

- **Breaking Changes**
  - The `valid` parameter is no longer available in parsed ids via `Bronze.parse()` - instead it will throw with the reason why the id is invalid. This closely resembles the functionality of `JSON.parse()`
  - `new Bronze([options])` will throw when passed invalid options. This will ensure all options are expected rather than falling back to the default options.
  - Node must be [built with the `crypto` module](https://nodejs.org/api/crypto.html#crypto_determining_if_crypto_support_is_unavailable) in order to use the CLI (*this is not required if you are not using the CLI feature*). The CLI requires this in order to support the new 2a - 2d specs.
  - `--sequence-dir` and `--sequence-dir-reset` have been replaced with `--cache-dir` and `--cache-reset-sequence` to allow better flexibility in the future
  - `output` is now an arg in `./lib/cli.js` and is no longer shared throughout the module, making things much cleaner
  - The CLI will now exit with status code `1` (along with displaying the help text) when invalid args are passed

## [1.4.0] - 2017-07-11

- [Added webpack for browser build & testing](https://github.com/AltusAero/bronze/commit/4312b40bfb670ebbce18941a5c18a911c5f09f1b)- [Added outdated package-lock.json for 1.3.0](https://github.com/AltusAero/bronze/commit/de0ba2669b94891b2850d0291f955c703ec80bb5)

## [1.3.0] - 2017-07-10

- [Minor: remove empty `standard.ignore` config](https://github.com/AltusAero/bronze/commit/900c15b7498b47e2205be997468b898a956028ca)
- [Prepare for browser support](https://github.com/AltusAero/bronze/commit/e5cd4260641517c1652277a1b7f16111da3cdbb7)
- [Updated dev dependencies](https://github.com/AltusAero/bronze/commit/5075013cc07ec43dee50d42fb5dcbde570c10570)

## [1.2.0] - 2017-06-21

- [Improve makeNestedDirectory logic](https://github.com/AltusAero/bronze/commit/55142fade8c9dde975d2174e1abe7aeb6d430616)
- [Fix: Windows #3](https://github.com/AltusAero/bronze/commit/820b02be47cccf062447da6aed533418aab7ba60)
- [Fix: Windows #2.1](https://github.com/AltusAero/bronze/commit/e8f09682684583a4e8965a72a43075e5e78fe486)
- [Fix: Windows #2](https://github.com/AltusAero/bronze/commit/a37bd80449efeef79ee66e984a9e47c4ede545b7)
- [Fix: Windows](https://github.com/AltusAero/bronze/commit/636be1e8d592e93ff628186fb2989823943a4e2a)
- [Allow current directory for `--sequence-dir`](https://github.com/AltusAero/bronze/commit/8dbf009f45af7d13b7c1b8e3ab510995793569cc)
- [`makeIfDirDoesntExist` -> `makeNestedDirectory`](https://github.com/AltusAero/bronze/commit/97560942b93bd69c32e351ab2921d13102104946)
- [Improve `makeIfDirDoesntExist` logic](https://github.com/AltusAero/bronze/commit/b32ac2668ad141e290a0dac72aae8bc55f8d6d62)

## [1.1.0] - 2017-06-09

- [Fix: breaking changes file path](https://github.com/AltusAero/bronze/commit/8138667003d73226c4b7cb926a2e893cb9c7b49c)
- [Fix: typo](https://github.com/AltusAero/bronze/commit/01b2df6135c9b91787aba85125e249c6b07dcbca)
- [updated test/ and data/ directories](https://github.com/AltusAero/bronze/commit/4c392a35a0969218e1708f884b41bed23d0bf907)
- [`tests` -> `test` to match conventions + `nyc` cleanup](https://github.com/AltusAero/bronze/commit/4d2c6f0e36e199d5930fc1e45214e099732efd50)
- [Added default params + modularized CLI](https://github.com/AltusAero/bronze/commit/5d4c500862a53cd308d493546b5b65c89862be01)
- [Update `nyc`](https://github.com/AltusAero/bronze/commit/73a12d03a1f22f3f24b2f55deeacaec3c8a57e70)
- [Minor: update breaking changes logic](https://github.com/AltusAero/bronze/commit/7818ec5075d55643dcbfce121dc123cc3651190c)

## [1.0.1] - 2017-06-01

- [Optimized sequence path logic](https://github.com/AltusAero/bronze/commit/eb46366de3eb8d09ab3b42d2453b733dca2797fa)
- [Fix: Tweak tests to work on Windows](https://github.com/AltusAero/bronze/commit/412ef5505d94524552bacf79e023ee36b16bc47d)
- [Fix: Update tests for Windows compatibility](https://github.com/AltusAero/bronze/commit/c62bd33a59aa9f96ee7b16215da5b3a150187146)
- [Fix: `--sequence-dir="${nonDefaultSequenceBadPermsDir}"`](https://github.com/AltusAero/bronze/commit/2cbb3c6a73ec65759d9c1864e02b1fb3a8bc1f54)
- [Use `execSync` on Windows](https://github.com/AltusAero/bronze/commit/aace34919e1f029869d304df37a83553ed2d52d7)
- [Updated `nonDefaultSequenceDeepDir` test case](https://github.com/AltusAero/bronze/commit/ae8c7de6aa9dd7160658fa4f4cbedee90a25fa1e)

## [1.0.0] - 2017-06-01

- [Updated tests](https://github.com/AltusAero/bronze/commit/aaa9b33408094cd797ffcadbbf85f192d51cb7c7)
- [Fix `makeIfDirDoesntExist` function](https://github.com/AltusAero/bronze/commit/db4f3ec86ac90fe0ef032bda705e9065a5103813)
- [Improved breaking changes support](https://github.com/AltusAero/bronze/commit/0a05b22ff5fb53722a0b1c1177704c14a0c0ddb2)
- [Bump `nyc`](https://github.com/AltusAero/bronze/commit/7c2782deda61d4040e5c5ea237955e82c6e7109e)
- [Clarify: --sequence-reset -> --sequence-dir-reset](https://github.com/AltusAero/bronze/commit/96c74066ee4104a9675470efb85e3f1c8cc3bfc6)
- [Bonus: available specs in --help output](https://github.com/AltusAero/bronze/commit/1f9c2181e983f93c0e2fb75de612a9379530b90b)
- [Drop Node 4 Support](https://github.com/AltusAero/bronze/commit/5186ce748f87935b96ce6bf70490db21934989e8)
- [Updated FUTURE](https://github.com/AltusAero/bronze/commit/ac9d412d5a7f73000f2dd7fba76f52f906a7f009)
- [Clarify: file isn't created if it doesn't exist](https://github.com/AltusAero/bronze/commit/ae0087d20f1b6d27d7d4041a928468a3f9f11bfe)
- [Updated `--sequence-dir` description](https://github.com/AltusAero/bronze/commit/04b21d371dfa3086a5c9ccee283e627a951d430a)
- [Added CLI support 🎉](https://github.com/AltusAero/bronze/commit/dca1fa7bd9deb93d4d7ebc16d89172f1808e4b9d)
- [Make executable](https://github.com/AltusAero/bronze/commit/8c7f84f8a862a467f4f4b65893d98265b5cc3ad6)
- [Fix nested id example](https://github.com/AltusAero/bronze/commit/a620633c08ef932ba3c7a672de3ef87dcf81cf9c)

## [0.3.0] - 2017-05-10

- [bump standard](https://github.com/AltusAero/bronze/commit/d26ed3dee043b80093b965a7bcd682a73bee7b41)
- [Slashes should invalidate ids for specs 1a and 1b](https://github.com/AltusAero/bronze/commit/ddd1bbceb5fcd27c49fe9f6b4d5d7acb067e679e)

## [0.2.3] - 2017-03-15

- [Updated dev dependencies](https://github.com/AltusAero/bronze/commit/61575a2a391556d379908a16786ddb14cc33d855)
- [Performance & Readability > Benchmarks](https://github.com/AltusAero/bronze/commit/00ec02ff43d4600b69a4bfc5fa301f12edc88879)

## [0.2.2] - 2017-01-30

- [Cleaned up documentation](https://github.com/AltusAero/bronze/commit/91ce47f41a89c01044a2062a4c2ec404fff29b01)
- [Make badges more portable for future projects](https://github.com/AltusAero/bronze/commit/b61a1c8194bd1970aa35f8ccd889f7da3b28e6da)
- [Move tests/config.json to data/tests/config.json](https://github.com/AltusAero/bronze/commit/d74fd58bc7018c025474925d079c6c3e34ef9f11)
- [Updated .gitignore](https://github.com/AltusAero/bronze/commit/f5ae6b65d57a2935da440990bb8a9a676983d977)

## [0.2.1] - 2017-01-09

- [Added coverage support, FUTURE.md, and auto-changelog scripts](https://github.com/AltusAero/bronze/commit/08d36863316a9c16b48dde3248c4c2eba53d4abd)
- [Simplified and cleaned up](https://github.com/AltusAero/bronze/commit/a6194ba7aa85de324819525719b822c2a09096bb)
- [Added coveralls and FUTURE.md](https://github.com/AltusAero/bronze/commit/7b5fef3a464c11f8ff07283d3ee56367aa25c534)
- [Added `coveralls` and `nyc`](https://github.com/AltusAero/bronze/commit/f4264840b22f1a16a5ec9afd4bd61fe4e7e1d77c)
- [Fix for coverage](https://github.com/AltusAero/bronze/commit/62fa34434874371a25a58ef4b2b7d1f62e6173cc)
- [Created templates for issues and pull requests](https://github.com/AltusAero/bronze/commit/5ef006585068c1748f2b04c2d06017c01d9011b5)
- [Apache License 2.0](https://github.com/AltusAero/bronze/commit/b930c8de80e61d22d43653c9e4ee064dc0d24bd6)
- [Update LICENSE](https://github.com/AltusAero/bronze/commit/baf4ba5db1128c676b8549b7473305cfec488aff)

- **Breaking Changes**
  - Dropped Node 4 support

## [0.2.0] - 2017-12-30

- [Updated license, added CONTRIBUTING.md, and updated README](https://github.com/AltusAero/bronze/commit/484d469b8b2d4f129c84ad90cf54e54e6ac9a46c)
- [Added Quick Start and fixed badges](https://github.com/AltusAero/bronze/commit/da74a32f3821264a5fd40aa8b752e6939d76ec33)
- [Add CONTRIBUTING.md](https://github.com/AltusAero/bronze/commit/9833f69a17a0af9c80165c56cec00751d3a6f3d9)
- [Apache 2.0](https://github.com/AltusAero/bronze/commit/67ff4af4e41842814d574c753e94bbf7f221bdca)

## [0.1.1] - 2017-12-29

- [Fixed package.json](https://github.com/AltusAero/bronze/commit/45ad3fbbd959ce4cf2661927a895be29252b57dd)
- [Fixed package.json](https://github.com/AltusAero/bronze/commit/6ddde2698ab47538801698fea0211dbb2d870b96)
- [Fix for Node.js 4](https://github.com/AltusAero/bronze/commit/2bf0b1747941ebb99b475b23a7d98fdbd518e65e)
- [Fixed tape script for Windows](https://github.com/AltusAero/bronze/commit/dd21d9e2aeda5fcaf9f33c26bd114875e3cccf58)
- [Fixed tape script](https://github.com/AltusAero/bronze/commit/dbb24dacd5dba06bdbaba137d1463881c3bf4a8d)
- [Added tests](https://github.com/AltusAero/bronze/commit/6ab4e92618bfc8c72381859b5e772d52c2189797)
- [added pre-commit for tests](https://github.com/AltusAero/bronze/commit/a547b16b9255ea15e436d937bf35baa04534b7e9)
- [Added tape as a stand-alone script](https://github.com/AltusAero/bronze/commit/51776d0a2a52e95b48a6702a8b46666043edff4e)
- [Initial commit.](https://github.com/AltusAero/bronze/commit/33679b46f18f0faefeb1a63738b75a7004fb7ff5)


[Unreleased]: https://github.com/AltusAero/bronze/compare/v2.0.0...staging
[2.0.0]: https://github.com/AltusAero/bronze/compare/v1.4.0...v2.0.0
[1.4.0]: https://github.com/AltusAero/bronze/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/AltusAero/bronze/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/AltusAero/bronze/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/AltusAero/bronze/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/AltusAero/bronze/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/AltusAero/bronze/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/AltusAero/bronze/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/AltusAero/bronze/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/AltusAero/bronze/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/AltusAero/bronze/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/AltusAero/bronze/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/AltusAero/bronze/tree/v0.1.1

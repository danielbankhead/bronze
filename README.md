# Bronze
## Collision-resistant ids for distributed systems

[![Bronze by Altus Aero][shield-io-altusaero]][altusaero-github] [![npm version][shield-io-npm-version]][npm] [![npm total downloads][shield-io-npm-total-downloads]][npm] [![npm license][shield-io-npm-license]][npm] [![AppVeyor][shield-io-AppVeyor]][appveyor] [![Travis CI][shield-io-Travis-CI]][travis] [![Travis CI][shield-io-Coveralls]][coveralls] [![GitHub - Issues Open][shield-io-GitHub-Issues-Open]][github-issues] [![GitHub - Pull Requests Open][shield-io-GitHub-Pull-Requests-Open]][github-pulls] [![GitHub - Contributors][shield-io-GitHub-Contributors]][github-graphs-contributors] [![Standard - JavaScript Style Guide][shield-io-standard-style]][standardjs]

[shield-io-altusaero]: https://img.shields.io/badge/altusaero-bronze-C9AE5D.svg?style=flat-square
[shield-io-npm-version]: https://img.shields.io/npm/v/bronze.svg?style=flat-square
[shield-io-npm-total-downloads]: https://img.shields.io/npm/dt/bronze.svg?style=flat-square
[shield-io-npm-license]: https://img.shields.io/npm/l/bronze.svg?style=flat-square
[shield-io-AppVeyor]: https://img.shields.io/appveyor/ci/DanielBankhead/bronze/master.svg?style=flat-square&label=appveyor
[shield-io-Travis-CI]: https://img.shields.io/travis/AltusAero/bronze/master.svg?style=flat-square&label=travis
[shield-io-Coveralls]: https://img.shields.io/coveralls/AltusAero/bronze.svg?style=flat-square
[shield-io-GitHub-Issues-Open]: https://img.shields.io/github/issues-raw/altusaero/bronze.svg?style=flat-square
[shield-io-GitHub-Pull-Requests-Open]: https://img.shields.io/github/issues-pr-raw/altusaero/bronze.svg?style=flat-square
[shield-io-GitHub-Contributors]: https://img.shields.io/github/contributors/altusaero/bronze.svg?style=flat-square
[shield-io-standard-style]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square

[altusaero-github]: https://github.com/altusaero/
[npm]: https://npmjs.com/package/bronze/
[appveyor]: https://ci.appveyor.com/project/DanielBankhead/bronze
[travis]: https://travis-ci.org/AltusAero/bronze
[coveralls]: https://coveralls.io/github/AltusAero/bronze
[github-issues]: https://github.com/AltusAero/bronze/issues
[github-pulls]: https://github.com/AltusAero/bronze/pulls
[github-graphs-contributors]: https://github.com/AltusAero/bronze/graphs/contributors
[standardjs]: http://standardjs.com/

<p align="center">
  <img title="Bronze logo" alt="Bronze logo" src="https://altusaero.net/opensource/bronze/logo/1.0/bronze.svg">
</p>

```js
const Bronze = require('bronze')

const b = new Bronze({name: 'example'})

const id = b.generate()
// 1482810226160-0-14210-example-1a
```

```sh
$ bronze --name example
# 1496196550327-31-7887-example-1a
```


## Installation

```sh
$ npm install bronze
```

Global CLI:
```sh
$ [sudo] npm install bronze -g
```


## Features

- Written in TypeScript, compiled to JavaScript for use in Node.js, browsers, or via CLI
- Designed for distributed and singleton systems
- Collision resistant - safely generate up to **9,007,199,254,740,991** ids within a single millisecond
  - No time-based (`UUID1`) or random (`UUID4`) collisions
- Fast - can generate an id in less than .05ms - _even on 10 year old hardware_
- Can be conveniently sorted via `timestamp` or `name`
- Conveniently exported in Commonjs and ES6 module formats


## Quick Start

```js
const Bronze = require('bronze')
const b = new Bronze()

b.generate()
// > 1483113483923-0-12179-localhost-1a
b.generate()
// > 1483113483923-1-12179-localhost-1a

// continue to create ids throughout your project
```


## Specs

A spec determines what goes into an id and how its information is sorted. Specs that end with `a` or `b` automatically replaces slashes (`\/`) with underscores (`_`) in `name`, making them more cross-platform filename/URL-friendly. Specs that end with `c` or `d` have their names passed as-is.

`Type 1` - contains a `timestamp` in milliseconds, a `sequence` number, a process id (`PID`), and a `name`
- `1a`, `1c` are formatted as `{timestamp}-{sequence}-{pid}-{name}-{spec}`
  - useful for timestamp-based sorting
  - ex: `1482981306438-0-5132-example-1a`
- `1b`, `1d` are formatted as `{name}-{pid}-{timestamp}-{sequence}-{spec}`
  - useful for name-based sorting
  - ex: `example-5132-1482981317498-0-1b`

`Type 2` - contains all attributes from `Type 1` with the addition of a random hexadecimal string. **The random string is not factored into the the id's uniqueness, but rather to make the next id in a sequence less predictable.** This is useful for situations where privacy is important, such as user ids and file uploads, while also preserving compatibility for URLs and file paths.
- `2a`, `2c` are formatted as `{timestamp}-{sequence}-{pid}-{randomString}-{name}-{spec}`
  - useful for timestamp-based sorting
  - ex: `1500050587899-1-2422-localhost-a3227cf0a08530e3b65f-2a`
- `2b`, `2d` are formatted as `{name}-{pid}-{timestamp}-{randomString}-{sequence}-{spec}`
  - useful for name-based sorting
  - ex: `example-1223-1500145125593-0-40d68422ab91c6b34f52-2b`


## Usage

### Node.js

TODO: jetta-style intro

See [examples](examples/).


### Browser

Using bronze in the browser is pretty straight-forward. As of [webpack](https://webpack.js.org) 4, no special loaders are required to use bronze. Since most browser environments do not support the `process` object (with the exception of [Electron](https://electron.atom.io), [NW.js](https://nwjs.io), and the like), you should pass the `pid` and `name` options to the constructor, like so:

```js
new Bronze({pid: 1, name: 'browser'})
```

Expanded Example:
```js
import Bronze from 'bronze'

function main () {
  const bronze = new Bronze({name: 'browser-example', pid: 1})
  const id = bronze.generate()

  const elem = document.getElementById('id-placement')

  if (elem !== null) {
    elem.innerText = id
  } else {
    console.dir({bronze, elem, id})
  }
}

main()
```

If you are using bronze in a distributed environment you should verify the generated `name` via `Bronze.parse` in a trusted space, such as the server-side.


### CLI

The CLI uses the module under the hood.
```txt
Usage: bronze [options]

Options:
  --sequence INT          Set the counter for the number of ids generated.
                          By default will use the 'sequence' file found in
                          the cache directory. If this value has been set
                          then the cached sequence file will not be updated
  --pid INT               Set the process id for generated ids.
  --name STRING           A unique name for the generator.
  --spec STRING           Set the spec

  --gen, -g INT           The number of ids to create. Must be >= 0.
                          Default = 1
  --list-specs            Get the specs available from this version of bronze
  --cache-dir STRING      Set the cache directory. This used for keeping
                          the sequence between executions. This directory
                          will attempt to create if not exist
  --cache-reset-sequence  Sets the sequence back to 0. The file is not created
                          if it doesn't exist
  --random-bytes INT      The number of pseudo-random bytes to generate for
                          any ids. This is uses the crypto module and is unique
                          for every generated id. If --spec option is not used,
                          then will default to the default random spec.
  --json, -j              Return the generated ids in JSON rather than a string

  --parse, -p STRING      Parse the given id into a JSON object
  --stringify STRING      Converts the given id in JSON format to a string

  --help, -h
  --version, -v
```

Can also be used via [`npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b):
```sh
$ npx bronze [options]
```


## Motivation

While developing a distributed system using `UUID1` and `UUID4` we found that we would run into collisions as we scaled.
  - `UUID1` (timeuuids) can have collisions within 100ns, which can happen when migrating/importing data in bulk
  - `UUID4` can have collisions at random. While the risk is reasonably small, a chance of data loss does not sit well with us, especially if one decides to generate millions of ids/day.
  - Being able to extract data from ids came as a secondary bonus


## Goals
  - no collisions
    - remove 'randomness' as an element for unique identifiers, which have the possibility of collisions
    - predictability > random/entropy
    - even a slim chance is unacceptable, mission-critical apps
  - keep it simple
  - fast - should be able to uniquely identify data in real-time apps
  - having different sorting/grouping options would be nice
  - a built-in counter (sequence) would be nice for statistics, especially if you can restore it after reboot
  - compatible with Node's `cluster` module with no additional setup
  - eliminate need for performance-draining read-before-writes to check if a unique identifier exists
  - reduced need for counters and auto-incrementing rows


## Notes
  - Node 8+ is required
  - If using via CLI Node.js must be built with [crypto support](https://nodejs.org/api/crypto.html#crypto_determining_if_crypto_support_is_unavailable) enabled (most installations have this by default).
  - Every machine in your distributed system should use a unique `name`. If every machine has a unique hostname (`process.env.HOSTNAME`) you should be fine.
  - To avoid collisions:
    - Do not reuse a `name` on a different machine within your distributed system's range of clock skew.
    - Be mindful when changing a system's clock - if moving the clock back temporarily change the `name`
    - Only one instance of Bronze should be created on a single process (`PID`) to avoid collisions.
      - Each worker spawned from Node's `cluster` module receives its own `PID` so no worries here.
  - Sequence counter automatically resets after reaching `Number.MAX_SAFE_INTEGER` (9007199254740991)
  - Without string parsing, timestamp sorting (specs `1a`, `1c`, `2a`, `2c`) is supported up to `2286-11-20T17:46:39.999Z` (9999999999999)
  - Using with databases, such as Cassandra:
    - most `text` data types should do the trick


## Future
  - Nested IDs
    - Example:
      ```js
      const id1 = b.generate({name: 'example'})
      console.log(id1)
      // > 1482810226160-0-14210-example-1a

      // Nested
      b.name = id1
      const id2 = b.generate()
      console.log(id2)
      // > 1482810226222-1-14210-1482810226160-0-14210-example-1a-1a

      Bronze.parse('1482810226222-1-14210-1482810226160-0-14210-example-1a-1a')
      // { valid: true,
      //   timestamp: 1482810226222,
      //   sequence: 1,
      //   pid: 14210,
      //   name: '1482810226160-0-14210-example-1a',
      //   spec: '1a' }

      // can also nest id2, id3, id4, id5, ...idN
      ```
    - the issue the moment is the possibility of collisions (no unique name)
    - would be pretty cool - imagine the convenience of nesting a `video_id` into a `comment_id`

  - See more in [FUTURE.md](FUTURE.md)

# Bronze
## Collision-resistant ids for distributed systems

[![Bronze by Altus Aero][shield-io-altusaero]][altusaero-github] [![npm version][shield-io-npm-version]][npm] [![npm total downloads][shield-io-npm-total-downloads]][npm] [![npm license][shield-io-npm-license]][npm] [![AppVeyor][shield-io-AppVeyor]][appveyor] [![Travis CI][shield-io-Travis-CI]][travis] [![Travis CI][shield-io-Coveralls]][coveralls] [![GitHub - Issues Open][shield-io-GitHub-Issues-Open]][github-issues] [![GitHub - Pull Requests Open][shield-io-GitHub-Pull-Requests-Open]][github-pulls] [![GitHub - Contributors][shield-io-GitHub-Contributors]][github-graphs-contributors] [![Standard - JavaScript Style Guide][shield-io-standard-style]][standardjs]

[shield-io-altusaero]: https://img.shields.io/badge/altusaero-bronze-C9AE5D.svg?style=flat-square
[shield-io-npm-version]: https://img.shields.io/npm/v/bronze.svg?style=flat-square
[shield-io-npm-total-downloads]: https://img.shields.io/npm/dt/bronze.svg?style=flat-square
[shield-io-npm-license]: https://img.shields.io/npm/l/bronze.svg?style=flat-square
[shield-io-AppVeyor]: https://img.shields.io/appveyor/ci/DanielBankhead/bronze.svg?style=flat-square&label=appveyor
[shield-io-Travis-CI]: https://img.shields.io/travis/AltusAero/bronze.svg?style=flat-square&label=travis
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



```js
const Bronze = require('bronze')

const idGen = new Bronze({name: 'example'})

const id = idGen.generate()
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

CLI only:
```sh
$ [sudo] npm install bronze -g
```


## Features

- designed for distributed and singleton systems
- no time-based (`UUID1`) or random (`UUID4`) collisions
- collision resistant - safely generate up to **9,007,199,254,740,991** ids within a single millisecond
- fast - can generate an id in less than .05ms - _even on old hardware_
- can be conveniently sorted by `timestamp` or `name`
- can be used as a module or via CLI
- supports Node 6+ and browsers


## Quick Start

```js
const Bronze = require('bronze')
const idGen = new Bronze()

idGen.generate()
// > 1483113483923-0-12179-localhost-1a
idGen.generate()
// > 1483113483923-1-12179-localhost-1a

// continue to create ids throughout your code
```


## Specs

A spec determines what goes into an id and how its information is sorted.

`Type 1` - contains a `timestamp` in milliseconds, a `sequence` number, a process id (`PID`), and a `name`
- `1a` is ordered by `timestamp` - `sequence` - `pid` - `name`
  - useful for timestamp-based sorting
  - ex: `1482981306438-0-5132-example-1a`
- `1b` is ordered by `name` - `pid` - `timestamp` - `sequence`
  - useful for name-based sorting
  - ex: `example-5132-1482981317498-0-1b`


## Usage

`Bronze` CLASS
  - _static_ _get_ `defaultName` STRING
    - the default name for new instances (if not provided)

  - _static_ _get_ `defaultSpec` STRING
    - the default spec for new instances

  - _static_ _get_ `specs` OBJECT
    - the default name

  - _static_ `parse` (id)
    - parses an id to JSON-compatible object

    - `id` STRING **required**
      - an id to parse

  - _new_ Bronze (options)
    - Example:
    ```js
    const idGen = new Bronze({name: 'example', sequence: 1})
    ```

    - `options` OBJECT
      - `sequence` INTEGER
        - the number of ids generated.
        - convenient for continuing creating ids where you left off (no pre-increment required)
        - if invalid falls back to default
        - _default_ = 0
      - `pid` INTEGER
        - a process id to number to use for generated ids
        - if invalid falls back to default
        - _default_ = process.pid, else 0
      - `name` STRING
        - a unique name for the generator - replaces slashes (\\/) with underscores (\_)
        - **IMPORTANT** - do not use the same name at the same time on different machines
        - if invalid falls back to default
        - _default_ = process.env.HOSTNAME, else _constructor_.defaultName
      - `spec` STRING
        - set the spec
        - if invalid falls back to default
        - _default_ = _constructor_.defaultSpec

    - _instance_ OBJECT
      - `sequence` INTEGER
        - the current sequence
      - `pid` INTEGER
        - the pid in use
      - `name` STRING
        - the parsed name to be used in ids
      - `nameRaw` STRING
        - the raw, pre-parsed name
      - `spec` STRING
        - the spec in use

      - `generate` ([options])
        - generates a new id
        - Example:
        ```js
        const idGen = new Bronze()
        const id = idGen.generate()
        // > 1482810226160-0-14210-localhost-1a
        ```

        - `options` OBJECT _optional_
          - `json` BOOLEAN
            - returns results as JSON-compatible object instead of STRING
            - _default_ = false

        - _return_ id STRING | OBJECT
          - The generated id
          - returns an object if `options.json === true`

      - `nextSequence` ()
        - manually advances the sequence
        - Example:
        ```js
        const idGen = new Bronze()
        idGen.nextSequence()
        ```

<!-- TODO:
  See [examples](examples).
-->
## Browser Usage

Using bronze in the browser is pretty straight-forward. As of [webpack](https://webpack.js.org) 3, no special loaders are required to use bronze. Since most browser environments do not support the `process` object (with the exception of [Electron](https://electron.atom.io), [NW.js](https://nwjs.io), and the like), you should pass the `pid` and `name` options to the constructor, like so:

```js
new Bronze({pid: 1, name: 'browser'})
```

If you are using bronze in a distributed environment you should verify the generated `name` via `Bronze.parse` in a trusted space, such as the server-side.



## CLI Usage

The CLI uses the module under the hood.

```
Usage: bronze [options]

Options:
  --sequence INT          Set the counter for the number of ids generated
                          By default will use sequence file (sequence path)
                          If set sequence file will not be updated
  --pid INT               Set the process id for generated ids
  --name STRING           A unique name for the generator
                          Any slashes will be replaced with underscores
  --spec STRING           Set the spec

  --gen, -g INT           The number of ids to create. Must be >= 0.
                          Default = 1
  --list-specs            Get the specs available from this version of bronze
  --sequence-dir STRING   Set the sequence directory
                          Will attempt to create if not exist
  --sequence-dir-reset    Sets the sequence back to 0
                          File isn't created if it doesn't exist

  --help, -h
  --version, -v
```


## Motivation

While developing a distributed system using `UUID1` and `UUID4` we found that we would run into collisions as we scaled.
  - `UUID1` (timeuuids) can have collisions within 100ns, which can happen when migrating/importing data in bulk
  - `UUID4` can have collisions at random. While the risk is reasonably small, a chance of data loss does not sit well with us.

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
  - Node 6+ is required for *1.x*+.
  - `name` may contain any character, including dashes, but slashes (\\/) will be replaced with underscores (\_).
    - This allows the opportunity for an id used as a cross-platform filename with little concern.
  - Every machine in your distributed system should use a unique `name`. If every machine has a unique hostname (`process.env.HOSTNAME`) you should be fine.
  - To avoid collisions:
    - Do not reuse a `name` on a different machine within your distributed system's range of clock skew.
    - Be mindful when changing a system's clock - if moving the clock back temporarily change the `name`
    - Only one instance of Bronze should be created on a single process (`PID`) to avoid collisions.
      - Each worker spawned from Node's `cluster` module receives its own `PID` so no worries here.
  - Sequence counter automatically resets after reaching `Number.MAX_SAFE_INTEGER` (9007199254740991)
  - Without string parsing, timestamp sorting (`spec 1a`) is supported up to `2286-11-20T17:46:39.999Z` (9999999999999)
  - Using with databases, such as Cassandra:
    - most `text` data types should do the trick


## Future
  - CLI
    - add `--parse` option
      - JSON output
  - Nested IDs
    ```js
    const id1 = idGen.generate({name: 'example'})
    console.log(id1)
    // > 1482810226160-0-14210-example-1a

    // Nested
    idGen.name = id1
    const id2 = idGen.generate()
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
    - would be pretty cool - imagine the convenience of nesting a video_id into a comment_id

  - See more in [FUTURE.md](FUTURE.md)

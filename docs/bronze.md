`Bronze` CLASS
  - _static_ _get_ `defaultName` => STRING
    - the default name for new instances (if not provided)

  - _static_ _get_ `defaultSpec` => STRING
    - the default spec for new instances where `randomGenerator` is not passed

  - _static_ _get_ `defaultSpecForRandom` => STRING
    - the default spec for new instances where `randomGenerator` is passed

  - _static_ _get_ `specs` => OBJECT
    - the default name

  - _static_ `bufferToHex` (b) => STRING
    - converts `Buffer`, `Array`<INTEGER>, or [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) to a hexadecimal string

    - `b` BUFFER | ARRAY | TYPEDARRAY
      - an object to convert to hexadecimal

    - _return_ hex
  - _static_ `format` (OBJECT id) => STRING | NULL
    - Formats an id in Object form to string
    - Unlike `stringify`, this function does not validate the object and does not throw
    - Returns `null` if cannot be formatted (such as an unknown spec)

  - _static_ `parse` (STRING id) => OBJECT
    - parses an id to JSON-compatible object
    - throws if invalid
    - See [**Specs**](#specs) section for returned object's attributes

    - `id` STRING
      - an id to parse

    - _return_ id

  - _static_ `stringify` () => STRING
    - Validates and formats an id in Object form to string
    - Unlike `format`, this function validates and throws on invalid properties

  - _new_ Bronze ([options])
    - Example:
      ```js
      const b = new Bronze({name: 'example', sequence: 1})
      ```

    - `options` OBJECT _optional_
      - `sequence` INTEGER
        - the number of ids generated. Should be a safe integer greater than 0
        - convenient for continuing creating ids where you left off (no pre-increment required)
        - _default_ = 0
      - `pid` INTEGER
        - a process id to number to use for generated ids
        - _default_ = process.pid, else 0
      - `name` STRING
        - a unique name for the generator
        - **IMPORTANT** - do not use the same name at the same time on different machines
        - _default_ = process.env.HOSTNAME, else _constructor_.defaultName
      - `randomGenerator` FUNCTION
        - Example:
          ```js
          // Node.js
          {randomGenerator: () => crypto.randomBytes(10)}
          // browser
          {randomGenerator: () => window.crypto.getRandomValues(new Uint8ClampedArray(10))}
          ```

        - the function to call when generating the random string for specs that require random bytes, such as `Type 2`.
        - should return a value compatible with _constructor_.bufferToHex (i.e. `Buffer`, `Array`<INTEGER>, or `TypedArray`) of any size/length (including 0)
        - if this option is used and the `spec` option has not been set, then bronze will use _constructor_.defaultSpecForRandom
        - See [examples](examples/random-generator/).
        - _default_ = `() => {}`
      - `spec` STRING
        - set the spec
        - _default_ = _constructor_.defaultSpec

    - _instance_ OBJECT
      - All properties can be reassigned post-creation, with the exception of `nameRaw` and `usingRandom`. Upon reassignment properties are re-evaluated for accuracy in order to guarantee the continued creation of valid ids.
      - `sequence` INTEGER
        - the current sequence
      - `pid` INTEGER
        - the pid in use
      - `name` STRING
        - the parsed name to be used in ids
        - automatically updates `nameRaw` upon reassignment for consistency
      - `nameRaw` STRING *read-only*
        - the raw, pre-parsed name
      - `randomGenerator` FUNCTION
        - the function used to generate random bytes
      - `spec` STRING
        - the spec in use
        - this can be reassigned if you would like to switch between specs
        - `name`/`nameRaw` are automatically updated for the spec (based on the pre-existing `nameRaw`)
          - For example:
          ```js
          b = new Bronze({spec: '1c', name: 'apple/jax_example'})
          b.name // 'apple/jax_example'

          b.spec = '1a'
          b.name // 'apple_jax_example'

          b.spec = '1c'
          b.name // 'apple/jax_example'
          ```
      - `usingRandom` BOOLEAN *read-only*
        - determines if the generator will use a random generator for the current spec

      - `generate` ([options]) => id STRING | OBJECT
        - generates a new id
        - Example:
          ```js
          const b = new Bronze()
          const id = b.generate()
          // > 1482810226160-0-14210-localhost-1a
          ```

        - `options` OBJECT _optional_
          - `json` BOOLEAN
            - returns results as JSON-compatible object instead of STRING with the following values:
              - name STRING
              - pid INT
              - randomString STRING | NULL
              - sequence INT
              - spec STRING
              - timestamp INT
            - _default_ = false

        - _return_ id
          - The generated id
          - returns an object if `options.json === true`
          - See [**Specs**](#specs) section for returned object's attributes

      - `nextSequence` ()
        - manually advances the sequence
        - Example:
          ```js
          const b = new Bronze()
          b.nextSequence()
          ```

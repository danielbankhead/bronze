## Future
  - CLI
    ```sh
    $ bronze
    # > returns an id
    $ bronze -n 10
    # > returns 10 ids
    ```
    <!-- TODO: { "bin" : { "bronze" : "./cli.js" } } -->
    <!-- TODO: ~/.bronze/${PID} sequence stream? -->

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

  - `examples/`
    - add a few examples

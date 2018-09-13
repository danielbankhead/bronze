## Future
  - More `examples/`
    - With images and video
  - `Bronze.sort`
    - Sort ids (strings or objects) in ascending or descending order
    - Can sort a list
    - first param = `Array` of objects, strings, or a mixture of both
    - seconds param = options
      - `options.sortBy` STRING | ARRAY
        - An `Array` for by which properties should be sorted by
        - Defaults to `['timestamp']`
          - Example: `['timestamp', 'sequence', 'name']`
        - When comparing 2 ids while sorting a list with mixed specs and one of the ids is missing a property the one with the property will be places after the id without the property (when using ascending order)
      - `options.idPath` STRING | ARRAY
        - An `Array` of the path of the path to the property that contains the id as a string
        - Used when the first parameter contains an `Object`
        - Defaults to `['id']`
        - Uses an array instead of a dot-delimited string so that non-string values, such as `Symbol`s can be used
        - Example:
          ```js
          const listOfIds = [
            {
              some: {
                nested: {
                  id: '1524530641873-9421234-785-example-1a'
                }
              }
            },
            {
              some: {
                nested: {
                  id: '1524530738067-9421235-820-localhost-1a'
                }
              }
            }
          ]

          Bronze.sort(listOfIds, {idPath: ['some', 'nested', 'id']})
          ```
        - NOTE: implementation:
          ```js
          function idFromObject (obj = '', path = []) {
            let got = obj

            for (const place of path) {
              got = got[place]
            }

            return got
          }
          ```
      - Perhaps a sorting algorithm option
  - Nested IDs
    - Example:
      ```js
      const Bronze = require('bronze')
      const b = new Bronze({name: 'example'})
      const id1 = b.generate()
      console.log(id1)
      // > 1510632576576-0-3513-example-1a

      // Nested
      b.name = id1
      const id2 = b.generate()
      console.log(id2)
      // > 1510632597222-1-3513-1510632576576-0-3513-example-1a-1a

      Bronze.parse('1510632597222-1-3513-1510632576576-0-3513-example-1a-1a')
      // { name: '1510632576576-0-3513-example-1a',
      // pid: 3513,
      // randomString: null,
      // sequence: 1,
      // spec: '1a',
      // timestamp: 1510632597222,
      // valid: true }

      // can also nest id2, id3, id4, id5, ...idN
      ```
    - the issue at the moment is the possibility of collisions (no unique name)
    - would be pretty useful - imagine the convenience of nesting a _video\_id_ into a _comment\_id_

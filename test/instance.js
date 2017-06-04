#! /usr/local/bin/node
'use strict'

const Bronze = require('../')
const config = require('../data/test/config')
const tape = require('tape')

tape('instance', (t) => {
  const defaultGenerator = new Bronze()
  const invalidSpec = 'InvalidSpec'

  t.equal(typeof defaultGenerator, 'object', '`new Bronze()` should return an object')
  t.equal((new Bronze({spec: invalidSpec})).spec, Bronze.defaultSpec, 'Invalid spec should fallback to default')

  for (let i = 0; i < config.specs.length; i++) {
    const spec = config.specs[i]
    const hostname = 'example-hostname'

    process.env.HOSTNAME = hostname

    let idGen = new Bronze({spec})

    t.equal(typeof idGen.sequence, 'number', `spec ${spec} - idGen.sequence should be a number`)
    t.equal((new Bronze({sequence: 21})).sequence, 21, `spec ${spec} - sequence should be configurable`)
    t.equal((new Bronze({sequence: Number.MAX_SAFE_INTEGER + 1})).sequence, 0, `spec ${spec} - invalid sequences should fallback to 0`)

    t.equal(typeof idGen.pid, 'number', `spec ${spec} - idGen.number should be a number`)
    t.equal((new Bronze({pid: 21})).pid, 21, `spec ${spec} - pid should be configurable`)
    t.equal((new Bronze({pid: Number.MAX_SAFE_INTEGER + 1})).pid, process.pid, `spec ${spec} - invalid pids should fallback to \`process.pid\``)

    t.equal(typeof idGen.name, 'string', `spec ${spec} - idGen.name should be a string`)
    t.equal((new Bronze({name: 'example'})).name, 'example', `spec ${spec} - name should be configurable`)
    t.equal(idGen.name, hostname, `spec ${spec} - name should default to \`process.env.HOSTNAME\` if \`process.env.HOSTNAME\` is available`)
    t.equal((new Bronze({name: 21})).name, hostname, `spec ${spec} - invalid names should fallback to \`process.env.HOSTNAME\` if \`process.env.HOSTNAME\` is available`)

    delete process.env.HOSTNAME

    t.equal((new Bronze()).name, Bronze.defaultName, `spec ${spec} - names should default to \`Bronze.defaultName\` if \`process.env.HOSTNAME\` is unavailable`)
    t.equal((new Bronze({name: 21})).name, Bronze.defaultName, `spec ${spec} - invalid names should fallback to \`Bronze.defaultName\` if \`process.env.HOSTNAME\` is unavailable`)

    t.equal((new Bronze({name: 'multi-part-name'})).name, 'multi-part-name', `spec ${spec} - names can have multiple parts`)
    t.equal((new Bronze({name: 'this/that'})).name, 'this_that', `spec ${spec} - names should not have '/'`)
    t.equal((new Bronze({name: 'this\\that'})).name, 'this_that', `spec ${spec} - names should not have '\\'`)

    t.equal(typeof idGen.nextSequence, 'function', `spec ${spec} - idGen.nextSequence should be function`)
    t.equal(idGen.nextSequence.length, 0, `spec ${spec} - idGen.nextSequence should have no arguments`)

    idGen.nextSequence()

    t.equal(idGen.sequence, 1, `spec ${spec} - idGen.nextSequence should increment by 1`)

    idGen.sequence = Number.MAX_SAFE_INTEGER
    idGen.nextSequence()

    t.equal(idGen.sequence, 0, `spec ${spec} - idGen.nextSequence should return to 0 after passing \`Number.MAX_SAFE_INTEGER\``)

    t.equal(typeof idGen.generate, 'function', `spec ${spec} - idGen.generate should be function`)
    t.equal(idGen.generate.length, 0, `spec ${spec} - idGen.generate should have 1 (default) argument`)

    t.equal(Bronze.parse(idGen.generate()).valid, true, `spec ${spec} - idGen.generate should create valid ids`)

    const jsonResults = idGen.generate({json: true})
    const invalidJsonArg = idGen.generate({json: 'invalidValue'})

    t.equal(typeof jsonResults, 'object', `spec ${spec} - Using \`json: true\` should return an object`)
    t.deepEqual(Object.keys(jsonResults), ['timestamp', 'sequence', 'pid', 'name', 'spec'], `spec ${spec} - \`json: true\` should have 'timestamp', 'sequence', 'pid', 'name', and 'spec' values`)

    t.equal(typeof invalidJsonArg, 'string', `spec ${spec} - using an invalid \`json\` argument should fallback to the default format (string)`)
    t.equal(Bronze.parse(invalidJsonArg).valid, true, `spec ${spec} - using an invalid \`json\` argument should fallback to the default format (string) and create a valid id`)

    idGen.spec = invalidSpec

    t.throws(() => idGen.generate(), /Unknown spec\./g, `spec ${spec} - An unknown spec should throw an error`)
  }

  t.end()
})

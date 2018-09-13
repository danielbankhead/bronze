#! /usr/local/bin/node
'use strict'

const Bronze = require('../')
const config = require('./.config')
const tape = require('tape')

tape('instance', (t) => {
  // Return message with context
  function m (context = '', message = '') {
    return `${context}: ${message}`
  }

  // Determines if an id is valid
  function v (id = '') {
    return Bronze.parse(id).valid
  }

  // Trails for the `generate` method
  function generateTrials (spec = null, context = '') {
    t.equal(typeof b.generate, 'function', `b.generate should be function`)
    t.equal(b.generate.length, 0, `b.generate should have 1 (default) argument`)

    t.equal(v(b.generate()), true, `spec ${spec} - b.generate should create valid ids`)

    const jsonResults = b.generate({json: true})
    const invalidJsonArg = b.generate({json: 'invalidValue'})

    t.equal(typeof jsonResults, 'object', `spec ${spec} - Using \`json: true\` should return an object`)
    t.deepEqual(Object.keys(jsonResults), ['timestamp', 'sequence', 'pid', 'name', 'spec'], `spec ${spec} - \`json: true\` should have 'timestamp', 'sequence', 'pid', 'name', and 'spec' values`)

    t.equal(typeof invalidJsonArg, 'string', `spec ${spec} - using an invalid \`json\` argument should fallback to the default format (string)`)
    t.equal(Bronze.parse(invalidJsonArg).valid, true, `spec ${spec} - using an invalid \`json\` argument should fallback to the default format (string) and create a valid id`)


    // For reference, if something were to throw at or after this point (post sequence increment) then there would be missing numbers in a list of sequences, which isn't very convenient for users expecting a consistent count
  }

  // Trails for the instance's name
  function nameTrials (spec = null, context = '') {
    t.equal((new Bronze({name: 'example'})).name, 'example', `name should be configurable`)

    const hostname = 'example-hostname'

    process.env.HOSTNAME = hostname

    t.equal((new Bronze({name: 21})).name, hostname, `invalid names (\`21\`) should fallback to \`process.env.HOSTNAME\` if \`process.env.HOSTNAME\` is available`)
    t.equal((new Bronze({name: null})).name, hostname, `invalid names (\`null\`) should fallback to \`process.env.HOSTNAME\` if \`process.env.HOSTNAME\` is available`)
    t.equal((new Bronze({name: {}})).name, hostname, `invalid names (\`{}\`) should fallback to \`process.env.HOSTNAME\` if \`process.env.HOSTNAME\` is available`)

    delete process.env.HOSTNAME

    t.equal((new Bronze({name: 21})).name, hostname, `invalid names (\`21\`) should default to \`Bronze.defaultName\` if \`process.env.HOSTNAME\` is unavailable`)
    t.equal((new Bronze({name: null})).name, hostname, `invalid names (\`null\`) should default to \`Bronze.defaultName\` if \`process.env.HOSTNAME\` is unavailable`)
    t.equal((new Bronze({name: {}})).name, hostname, `invalid names (\`{}\`) should default to \`Bronze.defaultName\` if \`process.env.HOSTNAME\` is unavailable`)

    t.equal((new Bronze({name: 'this/that'})).nameRaw, 'this/that', `raw name should be preserved - even it contains a '/'`)
    t.equal((new Bronze({name: 'this\\that'})).nameRaw, 'this\\that', `raw name should be preserved - even it contains a '\\'`)

    t.equal(defaultGenerator.name, Bronze.defaultName, `names should default to \`Bronze.defaultName\` if \`process.env.HOSTNAME\` is unavailable`)
    t.equal((new Bronze({name: 21})).name, Bronze.defaultName, `invalid names should fallback to \`Bronze.defaultName\` if \`process.env.HOSTNAME\` is unavailable`)
    t.equal((new Bronze({name: 'multi-part-name'})).name, 'multi-part-name', `names can have multiple parts`)


    // A/B
    t.equal((new Bronze({name: 'this/that'})).name, 'this_that', `names should not have '/'`)
    t.equal((new Bronze({name: 'this\\that'})).name, 'this_that', `names should not have '\\'`)
    // else

    t.equal((new Bronze({name: 'this/that', spec})).nameRaw, 'this/that', `raw name should be preserved - even it contains a '/'`)
    t.equal((new Bronze({name: 'this\\that', spec})).nameRaw, 'this\\that', `raw name should be preserved - even it contains a '\\'`)


    // TODO: name = '', name = '-' -> document
  }

  // Trails for the instance's pid
  function pidTrials (spec = null, context = '') {
    t.equal(typeof b.pid, 'number', `spec ${spec} - b.number should be a number`)

    t.equal((new Bronze({pid: 21})).pid, 21, `pid should be configurable`)
    t.equal((new Bronze({pid: Number.MAX_SAFE_INTEGER + 1})).pid, process.pid, `invalid pids should fallback to \`process.pid\``)

    b.pid = null

    t.throws(b.generate, /Process ID is not a safe integer/g, `spec ${spec} - An invalid pid should throw an error`)
  }

  // Trails for the instance's sequence and `nextSequence` method
  function sequenceTrials (spec = null, context = '') {
    t.equal(typeof b.sequence, 'number', `spec ${spec} - b.sequence should be a number`)

    t.equal((new Bronze({sequence: 21})).sequence, 21, `sequence should be configurable`)
    t.equal((new Bronze({sequence: Number.MAX_SAFE_INTEGER + 1})).sequence, 0, `invalid sequences should fallback to 0`)

    t.equal(typeof defaultGenerator.nextSequence, 'function', `\`nextSequence\` should be function`)
    t.equal(defaultGenerator.nextSequence.length, 0, `\`nextSequence\` should have no arguments`)

    b.nextSequence()

    t.equal(b.sequence, 1, `spec ${spec} - b.nextSequence should increment by 1`)

    b.sequence = Number.MAX_SAFE_INTEGER
    b.nextSequence()

    t.equal(b.sequence, 0, `spec ${spec} - b.nextSequence should return to 0 after passing \`Number.MAX_SAFE_INTEGER\``)
  }

  // Spec change support
  function specChangeSupport () {
    // TODO: if spec !== currentSpec -> assign then parse, validate
  }

  function trialsPerSpec (spec = null) {
    const context = spec === null ? 'Default' : `Spec ${spec}`

  }

  // General instance creation consistency checks
  t.deepEqual(new Bronze(), new Bronze({}), `\`new Bronze()\` and \`new Bronze({})\` should be functionally equivalent`)
  t.deepEqual(new Bronze(), new Bronze(null), `\`new Bronze()\` and \`new Bronze(null)\` should be functionally equivalent`)
  t.deepEqual(new Bronze(), new Bronze({spec: null}), `\`new Bronze()\` and \`new Bronze({spec: null})\` should be functionally equivalent`)

  // Checks for default spec settings
  t.equal((new Bronze()).spec, Bronze.defaultSpec, `Instances created without options should use \`Bronze.defaultSpec\``)
  t.equal((new Bronze({randomGenerator: () => {}})).spec, Bronze.defaultSpecForRandom, `Instances created with a randomGenerator function should use \`Bronze.defaultSpecForRandom\``)
  t.equal((new Bronze({randomGenerator: null})).spec, Bronze.defaultSpec, `Instances created where the randomGenerator is \`null\` should use \`Bronze.defaultSpec\``)
  t.equal((new Bronze({randomGenerator: {}})).spec, Bronze.defaultSpec, `Instances created where the randomGenerator is an object should use \`Bronze.defaultSpec\``)
  t.equal((new Bronze({randomGenerator: 'a'})).spec, Bronze.defaultSpec, `Instances created where the randomGenerator is a string should use \`Bronze.defaultSpec\``)
  t.equal((new Bronze({spec: 'InvalidSpec'})).spec, Bronze.defaultSpec, 'Instances Invalid spec should fallback to default')

  t.throws(() => {
    let b = new Bronze()
    b.spec = 'InvalidSpec'
    b.generate()
  }, /Unknown spec/g, `Assigning an invalid spec post-creation should throw an error`)

  // Run main trials
  trialsPerSpec()
  config.specs.forEach(trialsPerSpec)

  t.end()
})

#! /usr/local/bin/node
'use strict'

const Bronze = require('../')
const config = require('./config')
const tape = require('tape')

const util = require('util')

const validIdsKeys = Object.keys(config.validIds)

tape('class', (t) => {
  t.equal(typeof Bronze, 'function', 'Bronze should be a function')

  t.equal(typeof Bronze.defaultName, 'string', 'Bronze.defaultName should be a string')
  t.equal(typeof Bronze.defaultSpec, 'string', 'Bronze.defaultSpec should be a string')
  t.equal(typeof Bronze.specs, 'object', 'Bronze.specs should be an object')
  t.deepEqual(Object.keys(Bronze.specs), config.specs, 'Bronze.specs should only countain valid specs')

  for (let i = 0; i < config.specs.length; i++) {
    const spec = config.specs[i]
    t.equal(Bronze.specs[spec], true, `Bronze.specs['${spec}'] should return true`)
  }

  t.equal(typeof Bronze.parse, 'function', 'Bronze.parse should be a function')
  t.equal(Bronze.parse.length, 1, `Bronze.parse should have 1 argument`)

  for (let i = 0; i < validIdsKeys.length; i++) {
    const validId = validIdsKeys[i]

    t.equal(Bronze.parse(validId).valid, true, `'${validId}' should be an valid id`)
    t.deepEqual(Bronze.parse(validId), config.validIds[validId], `'${validId}' should be a valid id`)
  }

  for (let i = 0; i < config.invalidIds.length; i++) {
    const invalidId = config.invalidIds[i]

    t.equal(Bronze.parse(invalidId).valid, false, `\`${util.inspect(invalidId)}\` should be an invalid id`)
  }

  t.end()
})

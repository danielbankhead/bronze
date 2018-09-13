#! /usr/local/bin/node
'use strict'

const Bronze = require('../')
const config = require('./.config')
const tape = require('tape')

const util = require('util')

const validIdsKeys = Object.keys(config.validIds)

// TODO: test parse -> JSON compatibility

tape('class', (t) => {
  t.equal(typeof Bronze, 'function', 'Bronze should be a function (class)')

  t.equal(Bronze.defaultName, config.defaultName, 'Bronze.defaultName should be correct')
  t.equal(Bronze.defaultSpec, config.defaultRandomSpec, 'Bronze.defaultSpec should be correct')
  t.equal(Bronze.defaultSpecForRandom, config.defaultRandomSpec, 'Bronze.defaultSpecForRandom should be correct')

  // Check specs
  t.deepEqual(Object.keys(Bronze.specs), config.specs, 'Bronze.specs should only countain valid specs')
  for (const spec of config.specs) {
    t.equal(Bronze.specs[spec], true, `Bronze.specs['${spec}'] should return true`)
  }

  t.equal(typeof Bronze.parse, 'function', 'Bronze.parse should be a function')
  t.equal(Bronze.parse.length, 0, `Bronze.parse should have 1 (default) argument`)

  // Check parsing of valid ids
  for (const validId of validIdsKeys) {
    t.equal(Bronze.parse(validId).valid, true, `'${validId}' should be an valid id`)
    t.deepEqual(Bronze.parse(validId), config.validIds[validId], `'${validId}' should be a valid id`)
  }

  // Check parsing of invalid ids
  for (const invalidId of validIdsKeys) {
    t.equal(Bronze.parse(invalidId).valid, false, `\`${util.inspect(invalidId)}\` should be an invalid id`)
  }

  t.equal(Bronze.parse().valid, false, `Bronze.parse() w/o parameter should be an invalid id`)

  t.end()
})

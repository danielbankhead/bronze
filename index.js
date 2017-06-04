#! /usr/local/bin/node
'use strict'

class Bronze {
  constructor (options = {}) {
    options = Object.assign({}, options)

    if (Number.isSafeInteger(options.sequence) === true) {
      this.sequence = options.sequence
    } else {
      this.sequence = 0
    }

    this.pid = process.pid

    if (Number.isSafeInteger(options.pid) === true) {
      this.pid = options.pid
    }

    if (typeof options.name === 'string') {
      this.nameRaw = options.name
    } else if (typeof process.env.HOSTNAME === 'string') {
      this.nameRaw = process.env.HOSTNAME
    } else {
      this.nameRaw = this.constructor.defaultName
    }

    this.name = this.nameRaw.replace(/[\\/]/g, '_')

    if (this.constructor.specs[options.spec] === true) {
      this.spec = options.spec
    } else {
      this.spec = this.constructor.defaultSpec
    }
  }

  nextSequence () {
    this.sequence++
    if (Number.isSafeInteger(this.sequence) === false) {
      this.sequence = 0
    }
  }

  generate (options = {}) {
    const results = {
      timestamp: Date.now(),
      sequence: this.sequence,
      pid: this.pid,
      name: this.name,
      spec: this.spec
    }

    options = Object.assign({}, options)

    this.nextSequence()

    if (options.json === true) {
      return results
    } else {
      switch (results.spec) {
        case '1a':
          return `${results.timestamp}-${results.sequence}-${results.pid}-${results.name}-${results.spec}`
        case '1b':
          return `${results.name}-${results.pid}-${results.timestamp}-${results.sequence}-${results.spec}`
        default:
          throw new Error('Unknown spec.')
      }
    }
  }

  static get defaultName () {
    return 'localhost'
  }

  static get defaultSpec () {
    return '1a'
  }

  static get specs () {
    return {
      '1a': true,
      '1b': true
    }
  }

  static parse (id = '') {
    const results = {
      valid: false
    }

    if (typeof id !== 'string') {
      return results
    }

    const pieces = id.split('-')

    if (pieces.length < 5) {
      return results
    }

    const spec = pieces[pieces.length - 1]

    let timestamp = NaN
    let sequence = NaN
    let pid = NaN
    let name = ''

    switch (spec) {
      case '1a':
        timestamp = Number(pieces[0])
        sequence = Number(pieces[1])
        pid = Number(pieces[2])
        name = pieces.slice(3, pieces.length - 1).join('-')

        if (/[\\/]/.test(name)) {
          return results
        }
        break
      case '1b':
        sequence = Number(pieces[pieces.length - 2])
        timestamp = Number(pieces[pieces.length - 3])
        pid = Number(pieces[pieces.length - 4])
        name = pieces.slice(0, -4).join('-')

        if (/[\\/]/.test(name)) {
          return results
        }
        break
      default:
        return results
    }

    if (Number.isSafeInteger(timestamp) === true && Number.isSafeInteger(sequence) === true && Number.isSafeInteger(pid) === true) {
      results.valid = true
      results.timestamp = timestamp
      results.sequence = sequence
      results.pid = pid
      results.name = name
      results.spec = spec
    }

    return results
  }
}

module.exports = Bronze

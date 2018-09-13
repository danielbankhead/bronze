'use strict'

import * as types from './.types'
import * as errors from './lib/errors'

class Bronze {
  private private: types.BronzeInstanceProperties

  constructor (options?: types.BronzeInstanceOptions) {
    const normalizedOptions: types.BronzeInstanceOptions = {...options}

    this.private = {
      name: Bronze.defaultName,
      nameRaw: Bronze.defaultName,
      pid: 0,
      randomGenerator: () => new Uint8Array(0),
      sequence: 0,
      spec: Bronze.defaultSpec,
      useRandom: true
    }

    // Setup initial properties - the setters have validators
    if (normalizedOptions.sequence !== undefined) {
      this.sequence = normalizedOptions.sequence
    }

    if (typeof normalizedOptions.pid === 'number') {
      this.pid = normalizedOptions.pid
    } else {
      throw new errors.BronzeMissingProcessIdError()
    }

    if (normalizedOptions.randomGenerator !== undefined) {
      this.randomGenerator = normalizedOptions.randomGenerator
    }

    // Set spec by preference: given option, default random (if random generator provided), else default
    if (normalizedOptions.spec !== undefined) {
      if (Bronze.isValidBronzeSpec(normalizedOptions.spec)) {
        this.spec = normalizedOptions.spec
      } else {
        throw new errors.BronzeUnknownSpecError()
      }
    } else if (normalizedOptions.randomGenerator !== undefined) {
      this.spec = Bronze.defaultSpecForRandom
    }

    // Set name by preference: given option, process's hostname (if in Node.js), else default
    if (normalizedOptions.name !== undefined) {
      this.name = normalizedOptions.name
    } else {
      this.name = this.private.name
    }
  }

  get name (): string {
    return this.private.name
  }

  set name (v: string) {
    // If spec type a or b (such as '1a', '1b', '2a', '2b', etc.) then replace slashes with underscores
    if (/\d(a|b)$/.test(this.private.spec) === true) {
      this.private.name = v.replace(/[\\/]/g, '_')
    } else {
      this.private.name = v
    }

    this.private.nameRaw = v
  }

  get nameRaw (): string {
    return this.private.nameRaw
  }

  get pid (): number {
    return this.private.pid
  }

  set pid (v: number) {
    // TEST: negative integers
    if (Number.isSafeInteger(v) === true && v >= 0) {
      this.private.pid = v
    } else {
      throw new errors.BronzeInvalidPositiveIntegerError('Process id')
    }
  }

  get randomGenerator (): () => types.TypedArray {
    return this.private.randomGenerator
  }

  set randomGenerator (v: () => types.TypedArray) {
    this.private.randomGenerator = v
  }

  get sequence (): number {
    return this.private.sequence
  }

  set sequence (v: number) {
    // TEST: negative integers
    if (Number.isSafeInteger(v) === true && v >= 0) {
      this.private.sequence = v
    } else {
      throw new errors.BronzeInvalidPositiveIntegerError('Sequence')
    }
  }

  get spec (): types.BronzeSpec {
    return this.private.spec
  }

  set spec (v: types.BronzeSpec) {
    if (v in Bronze.specs) {
      this.private.spec = v

      // TODO: add test for (both) below
      // re-evaluates name, as spec may have different name requirements
      this.name = this.private.nameRaw
      this.private.useRandom = /^2[A-z]+/.test(this.private.spec)
    } else {
      throw new errors.BronzeUnknownSpecError()
    }
  }

  /** Reflects if the Bronze instance will use the provided `randomGenerator` for ids */
  get useRandom (): boolean {
    return this.private.useRandom
  }

  /** Generates a new id */
  generate (options?: types.BronzeGenerateStringOptions): string
  generate (options: types.BronzeGenerateObjectOptions): types.BronzeIdObject
  generate (options: types.BronzeGenerateOptions): string | types.BronzeIdObject {
    const id = {
      name: this.name,
      pid: this.pid,
      // TEST: random string always a string (think JSON-compat)
      randomString: this.useRandom === true ? Bronze.bufferToHex(this.randomGenerator()) : null,
      sequence: this.sequence,
      spec: this.spec,
      timestamp: Date.now()
    }

    // This generator should not contain any validators - the validators should be pre-computed on assignment for performance purposes rather than checking on each id generation
    // Nothing should throw after this point, making it a good time to increment the sequence. For reference, if something were to throw after this point (post sequence increment) then there would be missing numbers in a list of sequences, which isn't very convenient for users expecting a consistent count
    this.nextSequence()

    if (typeof options === 'object' && options.json === true) {
      return id
    } else {
      return Bronze.stringify(id)
    }
  }

  /** Increments the bronze sequence by 1. Rolls over on unsafe integer. */
  nextSequence (): number {
    const updatedSequence = this.sequence + 1

    if (Number.isSafeInteger(updatedSequence)) {
      this.sequence = updatedSequence
    } else {
      this.sequence = 0
    }

    return this.sequence
  }

  /** The default name for new Bronze instances */
  static get defaultName (): string {
    return 'localhost'
  }

  /** The default spec for new Bronze instances */
  static get defaultSpec (): types.BronzeSpec {
    return '1a'
  }

  /** The default spec for new Bronze instances where `randomGenerator` is provided */
  static get defaultSpecForRandom (): types.BronzeSpec {
    return '2a'
  }

  /** Specs available from this version of bronze */
  static get specs (): types.BronzeSpecs {
    return {
      '1a': true,
      '1b': true,
      '1c': true,
      '1d': true,
      '2a': true,
      '2b': true,
      '2c': true,
      '2d': true
    }
  }

  /** A buffer to convert to a hexidecimal string */
  static bufferToHex (buffer: types.TypedArray): string {
    // A buffer to convert to a hexidecimal string
    let hexSegments = []

    for (const b of buffer) {
      const hexSegment = (b & 255).toString(16).padStart(2, '0')
      hexSegments.push(hexSegment)
    }

    return hexSegments.join('')
  }

  /** Parses a bronze id in string form to an object */
  static parse (id: string): types.BronzeIdObject {
    let results: types.BronzeIdObject = {
      name: '',
      pid: NaN,
      randomString: null,
      sequence: NaN,
      spec: '1a',
      timestamp: NaN
    }

    const pieces = id.split('-')

    if (pieces.length < 5) {
      throw new errors.BronzeInvalidFormatError('Not enough dashes - invalid bronze id')
    }

    // Determine the spec
    const specCandidate = pieces[pieces.length - 1]

    if (Bronze.isValidBronzeSpec(specCandidate)) {
      results.spec = specCandidate
    } else {
      throw new errors.BronzeUnknownSpecError()
    }

    switch (results.spec) {
      case '1a':
      case '1c':
        results.timestamp = Number(pieces[0])
        results.sequence = Number(pieces[1])
        results.pid = Number(pieces[2])
        results.name = pieces.slice(3, pieces.length - 1).join('-')
        break
      case '1b':
      case '1d':
        results.sequence = Number(pieces[pieces.length - 2])
        results.timestamp = Number(pieces[pieces.length - 3])
        results.pid = Number(pieces[pieces.length - 4])
        results.name = pieces.slice(0, -4).join('-')
        break
      case '2a':
      case '2c':
        results.timestamp = Number(pieces[0])
        results.sequence = Number(pieces[1])
        results.pid = Number(pieces[2])
        results.name = pieces.slice(3, pieces.length - 2).join('-')
        results.randomString = pieces[pieces.length - 2]
        break
      case '2b':
      case '2d':
        results.sequence = Number(pieces[pieces.length - 3])
        results.timestamp = Number(pieces[pieces.length - 4])
        results.pid = Number(pieces[pieces.length - 5])
        results.name = pieces.slice(0, -5).join('-')
        results.randomString = pieces[pieces.length - 2]
        break
    }

    // If spec type a or b (such as '1a', '1b', '2a', '2b', etc.) then there shouldn't be any slashes
    if (/\d(a|b)$/.test(results.spec) && /[\\/]/.test(results.name)) {
      throw new errors.BronzeInvalidFormatError('Names for spec type type a and b should not have any slashes')
    }

    // Random string should be a valid hexidecimal string when using specs in category 2
    if (/^2[A-z]+/.test(results.spec)) {
      if (results.randomString === null) {
        throw new errors.BronzeInvalidFormatError('Random string should not be `null` when using specs in category 2')
      }

      if (typeof results.randomString === 'string' && /^[0-9a-fA-F]*$/.test(results.randomString) === false) {
        throw new errors.BronzeInvalidFormatError('Random string should be a valid hexidecimal string when using specs in category 2')
      }
    }

    // Validate number-based values, which is the final test for the determining if id is valid
    // TEST: negative integers
    if (Number.isSafeInteger(results.pid) === false || results.pid < 0) {
      throw new errors.BronzeInvalidPositiveIntegerError('Process id')
    } else if (Number.isSafeInteger(results.sequence) === false || results.sequence < 0) {
      throw new errors.BronzeInvalidPositiveIntegerError('Sequence')
    } else if (Number.isSafeInteger(results.timestamp) === false || results.timestamp < 0) {
      throw new errors.BronzeInvalidPositiveIntegerError('Timestamp')
    }

    return results
  }

  /** Converts a bronze id in JSON form to string */
  static stringify (id: types.BronzeIdObject): string {
    switch (id.spec) {
      case '1a':
        return `${id.timestamp}-${id.sequence}-${id.pid}-${id.name}-${id.spec}`
      case '1b':
        return `${id.name}-${id.pid}-${id.timestamp}-${id.sequence}-${id.spec}`
      case '1c':
        return `${id.timestamp}-${id.sequence}-${id.pid}-${id.name}-${id.spec}`
      case '1d':
        return `${id.name}-${id.pid}-${id.timestamp}-${id.sequence}-${id.spec}`
      case '2a':
        return `${id.timestamp}-${id.sequence}-${id.pid}-${id.name}-${id.randomString}-${id.spec}`
      case '2b':
        return `${id.name}-${id.pid}-${id.timestamp}-${id.sequence}-${id.randomString}-${id.spec}`
      case '2c':
        return `${id.timestamp}-${id.sequence}-${id.pid}-${id.name}-${id.randomString}-${id.spec}`
      case '2d':
        return `${id.name}-${id.pid}-${id.timestamp}-${id.sequence}-${id.randomString}-${id.spec}`
      default:
        throw new errors.BronzeUnknownSpecError()
    }
  }

  static isValidBronzeSpec (s: string): s is types.BronzeSpec {
    return s in Bronze.specs
  }
}

export default Bronze

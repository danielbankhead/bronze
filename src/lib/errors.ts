'use strict'

class BronzeInvalidFormatError extends RangeError {
  constructor (message: string) {
    super(message)
  }
}

class BronzeInvalidPositiveIntegerError extends RangeError {
  constructor (target: string) {
    super(`${target} is not a valid, safe integer than or equal to 0'`)
  }
}

class BronzeMissingProcessIdError extends TypeError {
  constructor () {
    super('Process id (`pid`) is required')
  }
}

class BronzeUnknownSpecError extends RangeError {
  constructor () {
    super('Unknown spec. Check your version of `bronze` and the available specs.')
  }
}

export {
  BronzeInvalidFormatError,
  BronzeInvalidPositiveIntegerError,
  BronzeUnknownSpecError,
  BronzeMissingProcessIdError
}

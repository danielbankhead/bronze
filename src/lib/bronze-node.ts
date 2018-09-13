'use strict'

import * as types from '../.types'
import Bronze from '../'

/** Bronze with handy defaults for Node.js */
class NodeBronze extends Bronze {
  constructor (options?: types.BronzeInstanceOptions) {
    const normalizedOptions: types.BronzeInstanceOptions = {...options}

    if (normalizedOptions.pid === undefined) {
      normalizedOptions.pid = process.pid
    }

    if (normalizedOptions.name === undefined && typeof process.env.HOSTNAME === 'string') {
      normalizedOptions.name = process.env.HOSTNAME
    }

    super(normalizedOptions)
  }
}

export default NodeBronze

// CommonJS override for importing using `require('bronze')`
module.exports = NodeBronze

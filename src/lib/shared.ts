#! /usr/bin/env node
'use strict'

import os from 'os'
import path from 'path'

export default {
  defaultCacheDir: path.join(os.homedir(), '.bronze')
}

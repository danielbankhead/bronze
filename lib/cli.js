#! /usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')

const Bronze = require('../')
const packageInfo = require('../package')

const defaultSequencePath = path._makeLong(path.join(os.homedir(), '.bronze', 'sequence'))
let output = console.log

function displayHelp () {
  const helpText = `
  bronze ${packageInfo.version}

  ${packageInfo.description}

  Usage: bronze [options]

  Options:
    --sequence INT          Set the counter for the number of ids generated
                            By default will use sequence file (sequence path)
                            If set sequence file will not be updated
    --pid INT               Set the process id for generated ids
    --name STRING           A unique name for the generator
                            Any slashes will be replaced with underscores
    --spec STRING           Set the spec

    --gen, -g INT           The number of ids to create. Must be >= 0.
                            Default = 1
    --list-specs            Get the specs available from this version of bronze
    --sequence-dir STRING   Set the sequence directory
                            Will attempt to create if not exist
    --sequence-dir-reset    Sets the sequence back to 0
                            File isn't created if it doesn't exist

    --help, -h
    --version, -v

  Notes:
    - Same name + same time + different machines = bad idea (collisions)
    - If any option is invalid will fallback to default
    - Any unknown arguments will cause help to print
    - Subsequent options of the same type will override existing:
      - Ex: \`bronze -g 1 -g 3\` will generate 3 ids
    - Options can be set in 2 styles if they require a value:
      - arg, arg    Ex: \`--sequence 1\`
      - equals      Ex: \`--sequence=1\`
    - Option Resolution:
      - If Help needs to print or requested, print. Process ends.
      - If List Specs requested, print. Process ends.
      - If version requested, print. Process ends.
      - Reset Sequence File, if requested.
      - If sequence option, use. Else read/create sequence directory
      - Generate requested ids with given options

  Available Specs:
    - ${Object.keys(Bronze.specs).join(' ')}

  Default Sequence Path:
    - ${defaultSequencePath}

  README.md:
    - ${path.join(__dirname, '..', 'README.md')}

  Bugs:
    - Email: ${packageInfo.bugs.email}
    - URL: ${packageInfo.bugs.url}

  License: ${packageInfo.license}`

  output(helpText)
}

function displaySpecs () {
  output(Object.keys(Bronze.specs).join(' '))
}
function displayVersion () {
  output(packageInfo.version)
}

function updateSequenceFile (sequencePath = '', sequenceCount = 0) {
  fs.writeFileSync(sequencePath, `${sequenceCount}`, 'utf8')
}

function makeIfDirDoesntExist (givenPath = '') {
  if (fs.existsSync(givenPath) === true) return

  try {
    fs.mkdirSync(givenPath)
  } catch (e) {
    if (e.code === 'ENOENT') {
      makeIfDirDoesntExist(path.parse(givenPath).dir)
      fs.mkdirSync(givenPath)
    } else {
      throw e
    }
  }
}

function readFromSequenceFile (sequencePath = '') {
  if (fs.existsSync(sequencePath) === false) {
    makeIfDirDoesntExist(path.parse(sequencePath).dir)
    return 0
  } else {
    const sequenceCountCandidate = Number(fs.readFileSync(sequencePath, 'utf8'))

    if (Number.isSafeInteger(sequenceCountCandidate) === true) {
      return sequenceCountCandidate
    }
  }
}

function generateIds (options = {}, count = 0, sequencePath = '') {
  const idGen = new Bronze(options)

  for (let i = 0; i < count; i++) {
    output(idGen.generate())
  }

  if (typeof sequencePath === 'string') {
    updateSequenceFile(sequencePath, idGen.sequence)
  }
}

function parseCommand (givenArgs = process.argv.slice(2)) {
  let bronzeOptions = {}
  let generateIdCount = 1
  let sequencePath = defaultSequencePath
  let isHelp = false
  let isListSpecs = false
  let isVersion = false
  let resetSequenceFile = false

  for (let i = 0, len = givenArgs.length; i < len; i++) {
    const arg = givenArgs[i].trim()
    let advanceAdditional = false
    let advanceAdditionalCandidate = false
    let valueCandidate = null

    if (arg.indexOf('--pid') === 0) {
      if (arg.indexOf('--pid=') === 0) {
        valueCandidate = Number(arg.slice('--pid='.length))
      } else {
        valueCandidate = Number(givenArgs[i + 1])
        advanceAdditionalCandidate = true
      }

      if (Number.isSafeInteger(valueCandidate) === true) {
        bronzeOptions.pid = valueCandidate
        if (advanceAdditionalCandidate === true) {
          advanceAdditional = true
        }
      }
    } else if (arg.indexOf('--name') === 0) {
      if (arg.indexOf('--name=') === 0) {
        valueCandidate = arg.slice('--name='.length)
      } else {
        valueCandidate = givenArgs[i + 1]
        advanceAdditionalCandidate = true
      }

      if (typeof valueCandidate === 'string') {
        bronzeOptions.name = valueCandidate
        if (advanceAdditionalCandidate === true) {
          advanceAdditional = true
        }
      }
    } else if (arg.indexOf('--spec') === 0) {
      if (arg.indexOf('--spec=') === 0) {
        valueCandidate = arg.slice('--spec='.length)
      } else {
        valueCandidate = givenArgs[i + 1]
        advanceAdditionalCandidate = true
      }

      if (typeof valueCandidate === 'string') {
        bronzeOptions.spec = valueCandidate
        if (advanceAdditionalCandidate === true) {
          advanceAdditional = true
        }
      }
    } else if (arg.indexOf('--gen') === 0) {
      if (arg.indexOf('--gen=') === 0) {
        valueCandidate = Number(arg.slice('--gen='.length))
      } else {
        valueCandidate = Number(givenArgs[i + 1])
        advanceAdditionalCandidate = true
      }

      if (Number.isSafeInteger(valueCandidate) === true && valueCandidate >= 0) {
        generateIdCount = valueCandidate
        if (advanceAdditionalCandidate === true) {
          advanceAdditional = true
        }
      }
    } else if (arg.indexOf('-g') === 0) {
      if (arg.indexOf('-g=') === 0) {
        valueCandidate = Number(arg.slice('-g='.length))
      } else {
        valueCandidate = Number(givenArgs[i + 1])
        advanceAdditionalCandidate = true
      }

      if (Number.isSafeInteger(valueCandidate) === true && valueCandidate >= 0) {
        generateIdCount = valueCandidate
        if (advanceAdditionalCandidate === true) {
          advanceAdditional = true
        }
      }
    } else if (arg.indexOf('--list-specs') === 0) {
      isListSpecs = true
    } else if (arg.indexOf('--sequence-dir-reset') === 0) {
      resetSequenceFile = true
    } else if (arg.indexOf('--sequence-dir') === 0) {
      if (arg.indexOf('--sequence-dir=') === 0) {
        valueCandidate = arg.slice('--sequence-dir='.length)
      } else {
        valueCandidate = givenArgs[i + 1]
        advanceAdditionalCandidate = true
      }

      if (typeof valueCandidate === 'string') {
        sequencePath = path._makeLong(path.join(valueCandidate, 'sequence'))
        if (advanceAdditionalCandidate === true) {
          advanceAdditional = true
        }
      }
    } else if (arg.indexOf('--sequence') === 0) {
      if (arg.indexOf('--sequence=') === 0) {
        valueCandidate = Number(arg.slice('--sequence='.length))
      } else {
        valueCandidate = Number(givenArgs[i + 1])
        advanceAdditionalCandidate = true
      }

      if (Number.isSafeInteger(valueCandidate) === true) {
        bronzeOptions.sequence = valueCandidate
        if (advanceAdditionalCandidate === true) {
          advanceAdditional = true
        }
      }
    } else if (arg.indexOf('--help') === 0 || arg.indexOf('-h') === 0) {
      isHelp = true
    } else if (arg.indexOf('--version') === 0 || arg.indexOf('-v') === 0) {
      isVersion = true
    } else {
      isHelp = true
    }

    if (advanceAdditional === true) {
      i++
    }
  }

  if (isHelp === true) {
    displayHelp()
  } else if (isListSpecs === true) {
    displaySpecs()
  } else if (isVersion === true) {
    displayVersion()
  } else {
    if (resetSequenceFile === true) {
      if (fs.existsSync(sequencePath) === true) {
        updateSequenceFile(sequencePath)
      }
    }

    if (typeof bronzeOptions.sequence === 'number') {
      generateIds(bronzeOptions, generateIdCount, null)
    } else {
      bronzeOptions.sequence = readFromSequenceFile(sequencePath)
      generateIds(bronzeOptions, generateIdCount, sequencePath)
    }
  }
}

if (module.parent === null) {
  parseCommand()
} else {
  module.exports = {
    displayHelp,
    displaySpecs,
    displayVersion,
    updateSequenceFile,
    makeIfDirDoesntExist,
    readFromSequenceFile,
    generateIds,
    parseCommand,
    get output () {
      return output
    },
    set output (o = console.log) {
      output = o
      return output
    }
  }
}

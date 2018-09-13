#! /usr/bin/env node
'use strict'

import fs from 'fs'
import path from 'path'

import * as types from '../.types'

import Bronze from './bronze-node'
import BronzeCLIParseArgResults from './cli-parse-arg-results'
import makeNestedDirectory from './make-nested-directory'
import packageInfo from '../../package.json'
import shared from './shared'

type output = (text: string) => string | void

class BronzeCLI {
  static displayHelp (o: output) {
    const helpText = `
    bronze ${packageInfo.version}

    ${packageInfo.description}

    Usage: bronze [options]

    Options:
      --sequence INT          Set the counter for the number of ids generated.
                              By default will use the 'sequence' file found in
                              the cache directory. If this value has been set
                              then the cached sequence file will not be updated
      --pid INT               Set the process id for generated ids.
      --name STRING           A unique name for the generator.
      --spec STRING           Set the spec

      --gen, -g INT           The number of ids to create. Must be >= 0.
                              Default = 1
      --list-specs            Get the specs available from this version of bronze
      --cache-dir STRING      Set the cache directory. This used for keeping
                              the sequence between executions. This directory
                              will attempt to create if not exist
      --cache-reset-sequence  Sets the sequence back to 0. The file is not created
                              if it doesn't exist
      --random-bytes INT      The number of pseudo-random bytes to generate for
                              any ids. This is uses the crypto module and is unique
                              for every generated id. If --spec option is not used,
                              then will default to the default random spec.
      --json, -j              Return the generated ids in JSON rather than a string

      --parse, -p STRING      Parse the given id into a JSON object
      --stringify STRING      Converts the given id in JSON format to a string

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

    Default Cache Directory:
      - ${shared.defaultCacheDir}

    README.md:
      - ${path.join(__dirname, '..', 'README.md')}

    Bugs:
      - Email: ${packageInfo.bugs.email}
      - URL: ${packageInfo.bugs.url}

    License: ${packageInfo.license}`

    o(helpText)
  }

  static displaySpecs (o: output) {
    o(Object.keys(Bronze.specs).join(' '))
  }

  static displayVersion (o: output) {
    o(packageInfo.version)
  }

  static updateSequenceFile (sequencePath = '', sequenceCount = 0) {
    fs.writeFileSync(sequencePath, `${sequenceCount}`, 'utf8')
  }

  static readFromSequenceFile (sequencePath = '') {
    // Create sequencePath if it does not exist, else read from it
    if (fs.existsSync(sequencePath) === false) {
      makeNestedDirectory(path.parse(sequencePath).dir)
      return 0
    } else {
      const sequenceCountCandidate = Number(fs.readFileSync(sequencePath, 'utf8'))

      if (Number.isSafeInteger(sequenceCountCandidate) === true) {
        return sequenceCountCandidate
      } else {
        return 0
      }
    }
  }

  static generateIds (options: types.BronzeInstanceOptions, g: types.BronzeGenerateOptions, count: number, sequencePath: string | null, o: output) {
    const b = new Bronze(options)

    for (let i = 0; i < count; i++) {
      if (typeof g === 'object' && g.json === true) {
        // Bronze id in object form
        o(JSON.stringify(b.generate(g), null, 2))
      } else {
        // Bronze in string form
        o(b.generate(g))
      }
    }

    if (typeof sequencePath === 'string') {
      BronzeCLI.updateSequenceFile(sequencePath, b.sequence)
    }
  }

  static parseArgs (args: string[] = []): BronzeCLIParseArgResults {
    let results = new BronzeCLIParseArgResults()
    let expandedArgs: string[] = []

    // TEST: bronze -phv
    // TEST: --name=test, --name test, --name=test=that, --name test=that

    // Expand multi-alias/short-flags
    for (const arg of args) {
      // Expand multi-alias/short-flags, such as '-phv' to '-p -h -v'
      if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
        const argWithoutLeadingFlag = arg.slice(1)
        for (const shorthandArg of argWithoutLeadingFlag) {
          expandedArgs.push(`-${shorthandArg}`)
        }
      } else {
        expandedArgs.push(arg)
      }
    }

    // Loop through each argument
    for (let i = 0; i < expandedArgs.length; i++) {
      const currentArg = expandedArgs[i]
      const arg = currentArg.trim()
      const argWithEqualSplit = arg.trim().split('=')
      const flag = results.flags[argWithEqualSplit[0]]
      let value = null

      // If given arg is not a flag then return as invalid
      if (typeof flag !== 'object') {
        results.invalidArgs = true
        return results
      }

      // Determine value
      if (flag.type === 'boolean') {
        value = true
      } else if (argWithEqualSplit.length > 1) {
        // For argument passed as `--key=value`
        value = argWithEqualSplit.slice(1).join('=')
      } else if (expandedArgs[i + 1]) {
        // For argument passed as `--key value`
        i++
        value = currentArg.trim()
      } else {
        // Expecting `--key value` style, but the next argument is not a string (i.e. `undefined`)
        results.invalidArgs = true
        return results
      }

      if (flag.type === 'number') {
        value = Number(value)

        if (Number.isSafeInteger(value) === false) {
          results.invalidArgs = true
          return results
        }
      }

      flag.handleValue(value)
    }

    return results
  }

  static parseCommand (givenArgs = process.argv.slice(2), o: output): boolean {
    // Parse Arguments
    const results = BronzeCLI.parseArgs(givenArgs)

    // Determine how to proceed based on the parsed results
    if (results.invalidArgs === true) {
      BronzeCLI.displayHelp(o)
      return false
    } else if (results.isHelp === true) {
      BronzeCLI.displayHelp(o)
    } else if (results.isListSpecs === true) {
      BronzeCLI.displaySpecs(o)
    } else if (results.isVersion === true) {
      BronzeCLI.displayVersion(o)
    } else if (results.parseString !== null) {
      o(JSON.stringify(Bronze.parse(results.parseString), null, 2))
    } else if (results.stringify !== null) {
      o(Bronze.stringify(JSON.parse(results.stringify)))
    } else {
      // Reset the sequence file, if requested, before generating any ids
      if (results.resetSequenceFile === true && fs.existsSync(results.sequencePath) === true) {
        BronzeCLI.updateSequenceFile(results.sequencePath, 0)
      }

      // Use sequence given sequence, if provided, otherwise use sequence file
      if (typeof results.bronzeInstanceOptions.sequence === 'number' && Number.isSafeInteger(results.bronzeInstanceOptions.sequence) === true) {
        BronzeCLI.generateIds(results.bronzeInstanceOptions, results.bronzeGenerateOptions, results.generateIdCount, null, o)
      } else {
        results.bronzeInstanceOptions.sequence = BronzeCLI.readFromSequenceFile(results.sequencePath)
        BronzeCLI.generateIds(results.bronzeInstanceOptions, results.bronzeGenerateOptions, results.generateIdCount, results.sequencePath, o)
      }
    }

    return true
  }
}

if (module.parent === null) {
  const success = BronzeCLI.parseCommand(undefined, console.log)

  if (success === false) {
    process.exit(1)
  }
}

export = BronzeCLI

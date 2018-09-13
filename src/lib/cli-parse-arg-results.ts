#! /usr/bin/env node
'use strict'

import crypto from 'crypto'
import path from 'path'

import * as types from '../.types'

import shared from './shared'

interface CLIFlags {
  [key: string]: {
    type: 'number' | 'boolean' | 'string'
    handleValue: Function
  } | undefined
}

class BronzeCLIParseArgResults {
  public bronzeInstanceOptions: types.BronzeInstanceOptions
  public bronzeGenerateOptions: types.BronzeGenerateOptions
  public invalidArgs: boolean
  public generateIdCount: number
  public sequencePath: string
  public isHelp: boolean
  public isListSpecs: boolean
  public isVersion: boolean
  public resetSequenceFile: boolean
  public parseString: string | null
  public stringify: string | null
  public flags: CLIFlags

  constructor () {
    this.bronzeInstanceOptions = {}
    this.bronzeGenerateOptions = {}
    this.invalidArgs = false
    this.generateIdCount = 1
    this.sequencePath = path.join(shared.defaultCacheDir, 'sequence')
    this.isHelp = false
    this.isListSpecs = false
    this.isVersion = false
    this.resetSequenceFile = false
    this.parseString = null
    this.stringify = null
    this.flags = {
      '--gen': {
        type: 'number',
        handleValue: (v: number) => {
          this.generateIdCount = v
        }
      },
      '--help': {
        type: 'boolean',
        handleValue: (v: boolean) => {
          this.isHelp = v
        }
      },
      '--list-specs': {
        type: 'boolean',
        handleValue: (v: boolean) => {
          this.isListSpecs = v
        }
      },
      '--name': {
        type: 'string',
        handleValue: (v: string) => {
          this.bronzeInstanceOptions.name = v
        }
      },
      '--pid': {
        type: 'number',
        handleValue: (v: number) => {
          this.bronzeInstanceOptions.pid = v
        }
      },
      '--random-bytes': {
        type: 'number',
        handleValue: (v: number) => {
          this.bronzeInstanceOptions.randomGenerator = () => crypto.randomBytes(v)
        }
      },
      '--sequence': {
        type: 'number',
        handleValue: (v: number) => {
          this.bronzeInstanceOptions.sequence = v
        }
      },
      '--cache-dir': {
        type: 'string',
        handleValue: (v: string) => {
          this.sequencePath = path.join(v, 'sequence')
        }
      },
      '--cache-reset-sequence': {
        type: 'boolean',
        handleValue: (v: boolean) => {
          this.resetSequenceFile = v
        }
      },
      '--spec': {
        type: 'string',
        handleValue: (v: string) => {
          this.bronzeInstanceOptions.spec = v
        }
      },
      '--version': {
        type: 'boolean',
        handleValue: (v: boolean) => {
          this.isVersion = v
        }
      },
      '--json': {
        type: 'boolean',
        handleValue: (v: boolean) => {
          if (this.bronzeGenerateOptions === undefined) {
            this.bronzeGenerateOptions = {json: true}
          } else {
            this.bronzeGenerateOptions.json = true
          }
        }
      },
      '--parse': {
        type: 'string',
        handleValue: (v: string) => {
          this.parseString = v
        }
      },
      '--stringify': {
        type: 'string',
        handleValue: (v: string) => {
          this.stringify = v
        }
      }
    }

    // aliases
    this.flags['-g'] = this.flags['--gen']
    this.flags['-h'] = this.flags['--help']
    this.flags['-j'] = this.flags['--json']
    this.flags['-p'] = this.flags['--parse']
    this.flags['-v'] = this.flags['--version']
  }
}

export default BronzeCLIParseArgResults

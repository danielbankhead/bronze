#! /usr/local/bin/node
'use strict'

const Bronze = require('../')
const config = require('../data/tests/config')
const packageInfo = require('../package')
const tape = require('tape')

const childProcess = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const cliPath = path.join(__dirname, '..', 'lib', 'cli.js')
const defaultName = process.env.HOSTNAME || 'localhost'
const defaultSequencePath = path._makeLong(path.join(os.homedir(), '.bronze', 'sequence'))
const nonDefaultSequenceDir = path._makeLong(path.join(os.homedir(), '.foo'))
const nonDefaultSequencePath = path.join(nonDefaultSequenceDir, 'sequence')
const nonDefaultSequenceBadPermsDir = path.join(nonDefaultSequenceDir, 'bar')
const nonDefaultSequenceDeepDir = path.join(nonDefaultSequenceDir, 'baz', 'cat', 'dog')
const nonDefaultSequenceDeepDirRollback = [path.join(nonDefaultSequenceDir, 'baz', 'cat'), path.join(nonDefaultSequenceDir, 'baz')]

tape('cli', (t) => {
  function deleteSequencePath (givenPath) {
    try {
      fs.unlinkSync(givenPath)
      fs.rmdirSync(path.parse(givenPath).dir)
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e
      }
    }
  }

  function runCLICommand (...args) {
    if (process.platform !== 'win32') {
      return childProcess.execFileSync(cliPath, args).toString().trim()
    } else {
      return childProcess.spawnSync(process.argv0, [cliPath, ...args]).stdout.toString().trim()
    }
  }

  const helpText = runCLICommand('--help')
  const listSpecsText = runCLICommand('--list-specs')
  const versionText = runCLICommand('--version')
  const helpTextLines = helpText.split('\n')
  let helpWidthGreaterThan80 = false

  deleteSequencePath(defaultSequencePath)
  deleteSequencePath(nonDefaultSequencePath)
  runCLICommand()

  for (let i = 0, len = helpTextLines.length; i < len; i++) {
    if (helpTextLines[i].length > 80) {
      helpWidthGreaterThan80 = true
    }
  }

  t.equal(helpWidthGreaterThan80, false, 'Help text\'s width shouldn\'t be greater than 80 chars')

  for (let i = 0; i < config.cli.helpCommands.length; i++) {
    const helpCommand = config.cli.helpCommands[i]

    t.equal(runCLICommand(...helpCommand), helpText, `\`${helpCommand.join(' ')}\` should be a --help command`)
  }

  t.equal(helpText.includes(defaultSequencePath), true, '--help should contain default sequence path')
  t.equal(helpText.includes(packageInfo.license), true, '--help should contain license from package.json')

  for (let i = 0; i < config.cli.listSpecsCommands.length; i++) {
    const listSpecsCommand = config.cli.listSpecsCommands[i]

    t.equal(runCLICommand(...listSpecsCommand), listSpecsText, `\`${listSpecsCommand.join(' ')}\` should be a --list-specs command`)
  }

  t.equal(helpText.includes(listSpecsText), true, '--list-specs should be in --help')
  t.equal(listSpecsText.includes('\n') === false && listSpecsText.includes(' '), true, 'specs in --list-specs should be listed space-seperated')
  t.deepEqual(listSpecsText.split(' '), config.specs, '--list-specs should only countain valid specs')

  for (let i = 0; i < config.cli.listSpecsCommands.length; i++) {
    const versionCommand = config.cli.versionCommands[i]

    t.equal(runCLICommand(...versionCommand), versionText, `\`${versionCommand.join(' ')}\` should be a version command`)
  }

  t.equal(helpText.includes(versionText), true, '--version should be in --help')
  t.equal(versionText, packageInfo.version, '--version match version from package.json')

  deleteSequencePath(defaultSequencePath)
  deleteSequencePath(nonDefaultSequencePath)

  runCLICommand()
  runCLICommand('--sequence-dir', nonDefaultSequenceDir)

  t.equal(fs.existsSync(defaultSequencePath), true, 'Default sequence path should exist once ran for the first time')
  t.equal(fs.existsSync(nonDefaultSequencePath), true, `Non-default sequence path should exist once ran for the first time`)

  t.equal(fs.readFileSync(defaultSequencePath).toString().trim(), '1', `Default sequence path should update`)
  t.equal(fs.readFileSync(nonDefaultSequencePath).toString().trim(), '1', `Non-default sequence path should update`)

  runCLICommand()
  runCLICommand('--sequence-dir', nonDefaultSequenceDir)

  t.equal(fs.readFileSync(defaultSequencePath).toString().trim(), '2', `Default sequence path should increment by 1`)
  t.equal(fs.readFileSync(nonDefaultSequencePath).toString().trim(), '2', `Non-default sequence path should increment by 1`)

  t.equal(Bronze.parse(runCLICommand('--sequence', '5')).sequence, 5, `--sequence should use given sequence`)
  t.equal(Bronze.parse(runCLICommand('--sequence', '5', '--sequence-dir', nonDefaultSequenceDir)).sequence, 5, `--sequence should use given sequence, even if --sequence-dir is used`)

  t.equal(fs.readFileSync(defaultSequencePath).toString().trim(), '2', `--sequence should not update default sequence path`)
  t.equal(fs.readFileSync(nonDefaultSequencePath).toString().trim(), '2', `--sequence should not update non-default sequence path`)

  deleteSequencePath(defaultSequencePath)
  deleteSequencePath(nonDefaultSequencePath)

  runCLICommand(`-g=5`)
  runCLICommand(`-g=5`, `--sequence-dir=${nonDefaultSequenceDir}`)

  runCLICommand('--sequence-dir-reset')
  runCLICommand('--sequence-dir-reset', `--sequence-dir=${nonDefaultSequenceDir}`)

  t.equal(fs.readFileSync(defaultSequencePath).toString().trim(), '1', `--sequence-dir-reset set default sequence path to 0 (1 post-generated)`)
  t.equal(fs.readFileSync(nonDefaultSequencePath).toString().trim(), '1', `--sequence-dir-reset set --sequence-dir to 0 (1 post-generated)`)

  deleteSequencePath(defaultSequencePath)
  deleteSequencePath(nonDefaultSequencePath)

  runCLICommand('--sequence', '5')
  runCLICommand('--sequence', '5', '--sequence-dir', nonDefaultSequenceDir)

  t.equal(fs.existsSync(defaultSequencePath), false, `--sequence should not create default sequence path if it doesn't exist`)
  t.equal(fs.existsSync(nonDefaultSequencePath), false, `--sequence should not create --sequence-dir if it doesn't exist`)

  runCLICommand('--sequence=5', '--sequence-dir-reset')
  runCLICommand('--sequence=5', '--sequence-dir-reset', `--sequence-dir=${nonDefaultSequenceDir}`)

  t.equal(fs.existsSync(defaultSequencePath), false, `--sequence=5 --sequence-dir-reset should not create default sequence path if it doesn't exist`)
  t.equal(fs.existsSync(nonDefaultSequencePath), false, `--sequence=5 --sequence-dir-reset --sequence-dir should not create --sequence-dir if it doesn't exist`)

  t.equal(Bronze.parse(runCLICommand('--sequence=5', '--sequence', '1')).sequence, 1, `--sequence=5 --sequence 1 should overwrite`)
  t.equal(Bronze.parse(runCLICommand('--sequence', '5', '--sequence=10')).sequence, 10, `--sequence 5 --sequence=10 should overwrite`)

  runCLICommand('--sequence-dir')

  t.equal(fs.existsSync(defaultSequencePath), true, `--sequence-dir (no-args) should use default sequence directory`)

  runCLICommand(`--sequence-dir=${nonDefaultSequenceDir}`)
  fs.mkdirSync(nonDefaultSequenceBadPermsDir)
  fs.chmodSync(nonDefaultSequenceBadPermsDir, 0)

  const tSequenceDirResetMessage = `--sequence-dir-reset should throw if error !== exist`
  const tSequenceDirResetArgs = ['--sequence-dir-reset', `--sequence-dir=${nonDefaultSequenceBadPermsDir}`]

  t.equal(childProcess.spawnSync(process.argv0, [cliPath, ...tSequenceDirResetArgs]).status, 1, tSequenceDirResetMessage)

  const tSequenceDirMessage = `--sequence-dir should throw if error !== exist`
  const tSequenceDirArgs = [`--sequence-dir=${nonDefaultSequenceBadPermsDir}`]

  t.equal(childProcess.spawnSync(process.argv0, [cliPath, ...tSequenceDirArgs]).status, 1, tSequenceDirMessage)

  fs.rmdirSync(nonDefaultSequenceBadPermsDir)

  fs.writeFileSync(nonDefaultSequencePath, 'example', 'utf8')

  runCLICommand(`--sequence-dir=${nonDefaultSequenceDir}`)
  t.equal(fs.readFileSync(nonDefaultSequencePath).toString().trim(), '1', `Invalid Numbers in sequence path should be replaced with the new sequence`)

  deleteSequencePath(nonDefaultSequencePath)
  runCLICommand(`--sequence-dir=${nonDefaultSequenceDeepDir}`)
  t.equal(fs.readFileSync(path.join(nonDefaultSequenceDeepDir, 'sequence')).toString().trim(), '1', `--sequence-dir should handle multiple levels of depth`)

  deleteSequencePath(path.join(nonDefaultSequenceDeepDir, 'sequence'))
  for (let i = 0, len = nonDefaultSequenceDeepDirRollback.length; i < len; i++) {
    fs.rmdirSync(nonDefaultSequenceDeepDirRollback[i])
  }

  runCLICommand(`--sequence-dir=${nonDefaultSequenceDir}`)
  deleteSequencePath(nonDefaultSequencePath)

  const genCompare = [runCLICommand('--gen=5').split('\n').length, runCLICommand('--gen', '5').split('\n').length, runCLICommand('-g=5').split('\n').length, runCLICommand('-g', '5').split('\n').length]
  const genUnique = runCLICommand('--gen=2').split('\n')

  t.equal(runCLICommand('--gen=5').split('\n').length, 5, `--gen=5 should create 5 ids seperated by line`)
  t.equal(genUnique[0] === genUnique[1], false, `--gen should generate unique ids, not multiple of the same`)
  t.equal(Bronze.parse(genUnique[0]).pid === Bronze.parse(genUnique[1]).pid, true, `--gen should generate unique ids with the same PID`)
  t.deepEqual(genCompare, [5, 5, 5, 5], `--gen=5, --gen 5, -g=5, -g 5 should all create the same number of ids`)

  t.equal(runCLICommand('--gen=5', '--gen=1').split('\n').length, 1, `--gen=5 --gen=1 should overwrite`)
  t.equal(runCLICommand('--gen', '5', '--gen', '10').split('\n').length, 10, `--gen 5 --gen 10 should overwrite`)
  t.equal(runCLICommand('-g=5', '-g=10').split('\n').length, 10, `-g=5 -g=10 should overwrite`)
  t.equal(runCLICommand('-g', '5', '-g', '1').split('\n').length, 1, `-g 5 -g 1 should overwrite`)

  t.equal(Bronze.parse(runCLICommand('--pid=5')).pid, 5, `--pid=5 should generate an id with pid`)

  t.equal(Bronze.parse(runCLICommand('--pid=5', '--pid', '1')).pid, 1, `--pid=5 --pid 1 should overwrite`)
  t.equal(Bronze.parse(runCLICommand('--pid', '5', '--pid=10')).pid, 10, `--pid 5 --pid=10 should overwrite`)

  t.equal(Bronze.parse(runCLICommand('--name=example')).name, 'example', `--name=example should generate an name 'example'`)

  t.equal(Bronze.parse(runCLICommand('--name=example', '--name', 'foo')).name, 'foo', `--name=example --name foo should overwrite`)
  t.equal(Bronze.parse(runCLICommand('--name', 'example', '--name=bar')).name, 'bar', `--name example --name=bar should overwrite`)
  t.equal(Bronze.parse(runCLICommand('--name')).name, defaultName, `--name (no args) should not generate with a name.`)

  for (let i = 0; i < config.specs.length; i++) {
    const spec = config.specs[i]
    let overwriteSpec = config.specs[0]

    t.equal(Bronze.parse(runCLICommand(`--spec=${spec}`)).spec, spec, `--spec=${spec} should be a valid spec`)
    t.equal(Bronze.parse(runCLICommand('--spec', spec)).spec, spec, `--spec ${spec} should be a valid spec`)

    if (i === 0) {
      overwriteSpec = config.specs[1]
    }

    t.equal(Bronze.parse(runCLICommand(`--spec=${spec}`, '--spec', overwriteSpec)).spec, overwriteSpec, `--spec=${spec} --spec ${overwriteSpec} should overwrite`)
    t.equal(Bronze.parse(runCLICommand('--spec', spec, `--spec=${overwriteSpec}`)).spec, overwriteSpec, `--spec ${spec} --spec=${overwriteSpec} should overwrite`)
  }

  t.equal(Bronze.parse(runCLICommand(`--spec`)).spec, config.defaultSpec, `--name (no args) should use to default spec.`)

  deleteSequencePath(defaultSequencePath)
  deleteSequencePath(nonDefaultSequencePath)

  t.end()
})

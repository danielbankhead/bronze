#! /usr/local/bin/node
'use strict'

const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

const packageInfo = require('../package')
const changelogFilePath = path.join(__dirname, '..', 'CHANGELOG.md')

fs.readFile(changelogFilePath, 'utf8', (error, data) => {
  if (error !== null) throw error

  fs.writeFile(changelogFilePath, `## [${packageInfo.version}]\n\n${data}`, (error) => {
    if (error !== null) throw error

    childProcess.execFile('git', ['add', changelogFilePath], (error, stdout, stderr) => {
      if (error !== null) throw error
    })
  })
})

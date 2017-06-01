#! /usr/local/bin/node
'use strict'

const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

const packageInfo = require('../package')
const gitLogFormat = '--format=- ### %s%n  - %H%n  - Author: **%an**%n  - Date: %ai%n'
const changelogFilePath = path.join(__dirname, '..', 'CHANGELOG.md')

fs.readFile(changelogFilePath, 'utf8', (error, data) => {
  if (error !== null) {
    if (error.code === 'ENOENT') {
      fs.writeFileSync(changelogFilePath, '')
      data = ''
    } else {
      throw error
    }
  }

  childProcess.execFile('git', ['--no-pager', 'log', `v${packageInfo.version}..HEAD`, gitLogFormat], (error, stdout, stderr) => {
    if (error !== null) throw error

    fs.writeFile(changelogFilePath, `${stdout}${data}`, (error) => {
      if (error !== null) throw error
    })
  })
})

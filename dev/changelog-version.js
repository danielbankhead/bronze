#! /usr/local/bin/node
'use strict'

const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

const packageInfo = require('../package')
const changelogFilePath = path.join(__dirname, '..', 'CHANGELOG.md')
const breakingChangesFilePath = path.join(__dirname, '..', 'docs', 'BREAKING-CHANGES.md')

fs.readFile(changelogFilePath, 'utf8', (error, existingData) => {
  if (error !== null) throw error

  let breakingChangesData = `${fs.readFileSync(breakingChangesFilePath, 'utf8').trim()}\n\n`
  if (breakingChangesData.trim() === '') {
    breakingChangesData = ''
  }

  fs.writeFile(changelogFilePath, `## [${packageInfo.version}]\n\n${breakingChangesData.trim()}${existingData}`, (error) => {
    if (error !== null) throw error

    childProcess.execFile('git', ['add', changelogFilePath], (error, stdout, stderr) => {
      if (error !== null) throw error
    })
  })
})

#! /usr/local/bin/node
'use strict'

import fs from 'fs'
import path from 'path'

function makeNestedDirectory (givenPath = '') {
  if (givenPath === '') givenPath = process.cwd()

  // No need to create a directory if it exists
  if (fs.existsSync(givenPath) === true && fs.statSync(givenPath).isDirectory() === true) {
    return
  }

  try {
    fs.mkdirSync(givenPath)
  } catch (e) {
    const candidatePathDir = path.parse(givenPath).dir

    // If the parent directory does not exist attempt to create it, else throw error
    if (fs.existsSync(candidatePathDir) === false && givenPath !== candidatePathDir) {
      makeNestedDirectory(candidatePathDir)
      fs.mkdirSync(givenPath)
    } else {
      throw e
    }
  }
}

export default makeNestedDirectory

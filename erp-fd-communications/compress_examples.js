#!/usr/bin/env node

// Your code goes here
const fs = require('fs');
const path = require('path');

const examplesPath = './testdata';

const getFiles = (dir) => {
  const files = fs.readdirSync(dir);
  console.log(files);
  const fileDict = {};

  files.forEach((directory) => {
    const files = fs.readdirSync(path.join(dir, directory));
    console.log(directory);
    fileDict[directory] = {};
    files.forEach((file) => {
      console.log(file);
        const filePath = path.join(dir, directory, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        fileDict[directory][file.replace('.json','')] = fileContent;
    })
  });

  return fileDict;
};

const examplesDict = getFiles(examplesPath);
console.log(examplesDict);

fs.writeFileSync('examples.json', JSON.stringify(examplesDict, null, 2));

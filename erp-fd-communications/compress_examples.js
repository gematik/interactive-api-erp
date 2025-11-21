#!/usr/bin/env node

/*
Copyright (Change Date see Readme), gematik GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*******

For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
*/

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

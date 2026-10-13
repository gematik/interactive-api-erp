//
//  Copyright (Change Date see Readme), gematik GmbH
//
//  Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
//  European Commission – subsequent versions of the EUPL (the "Licence").
//  You may not use this work except in compliance with the Licence.
//
//  You find a copy of the Licence in the "Licence" file or at
//  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the Licence is distributed on an "AS IS" basis,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
//  In case of changes by gematik find details in the "Readme" file.
//
//  See the Licence for the specific language governing permissions and limitations under the Licence.
//
//  *******
//
// For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
//

/*
 * Shared helpers for the Communication payload schema tests.
 *
 * The schemas are draft-07 JSON Schemas, so we validate with Ajv v6
 * (the same major version already vendored in ../interactive/node_modules).
 */
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const SCHEMA_DIR = path.join(__dirname, '..');

function loadSchema(fileName) {
  const raw = fs.readFileSync(path.join(SCHEMA_DIR, fileName), 'utf-8');
  return JSON.parse(raw);
}

function compile(fileName) {
  const ajv = new Ajv({ allErrors: true });
  return ajv.compile(loadSchema(fileName));
}

// Reads one of the checked-in example payloads under ../testdata/<group>/<name>.json
function loadExample(group, name) {
  const raw = fs.readFileSync(
    path.join(SCHEMA_DIR, 'testdata', group, `${name}.json`),
    'utf-8',
  );
  return JSON.parse(raw);
}

module.exports = { compile, loadExample, loadSchema };

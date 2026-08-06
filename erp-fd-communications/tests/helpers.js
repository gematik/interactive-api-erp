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

/*
 * CommunicationDispReqPayload.json vs. gemSpec_DM_eRp 2.7.1
 * (A_23876-01 / Tabelle 8, TAB_eRpDM_002 "E-Rezept einer Apotheke zuweisen").
 *
 * These tests encode the SPEC-correct expectations. Tests tagged [ISSUE ...]
 * currently FAIL against the schema in its present state and pinpoint a
 * divergence from the specification; they are expected to pass once the
 * schema is corrected. Tests tagged [control]/[guard] document behaviour
 * that must keep working after any fix.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { compile, loadExample } = require('./helpers');

const validate = compile('CommunicationDispReqPayload.json');

function check(payload) {
  const valid = validate(payload);
  return { valid, errors: validate.errors };
}

// A complete, spec-valid delivery order used as a base for mutations.
function deliveryOrder(overrides = {}) {
  return {
    version: 3,
    communicationType: 'order',
    supplyOptionsType: 'delivery',
    firstname: 'Max',
    lastname: 'Mustermann',
    address: 'Musterstraße 555',
    postcode: '55555',
    city: 'Musterhausen',
    country: 'DE',
    phone: '004916094858168',
    transactionID: '8196b610-9b77-47ab-936e-362cd92ef2aa',
    ...overrides,
  };
}

test('[control] valid delivery order validates', () => {
  const { valid, errors } = check(loadExample('dispReq', '01_delivery'));
  assert.equal(valid, true, JSON.stringify(errors, null, 2));
});

test('[control] valid reservation order validates', () => {
  const { valid, errors } = check(loadExample('dispReq', '03_reservation'));
  assert.equal(valid, true, JSON.stringify(errors, null, 2));
});

test('[ISSUE D1] a text message must be valid without supplyOptionsType', () => {
  // Spec: for communicationType = text, supplyOptionsType is FORBIDDEN, yet the
  // schema root marks supplyOptionsType as required -> a valid text message can
  // never validate.
  const { valid, errors } = check(loadExample('dispReq', '04_message'));
  assert.equal(
    valid,
    true,
    'text message rejected although it must be valid: ' +
      JSON.stringify(errors, null, 2),
  );
});

test('[ISSUE D2] communicationType=text must forbid supplyOptionsType', () => {
  // Spec: supplyOptionsType is forbidden when communicationType = text.
  // The per-branch communicationType is not actually pinned (the non-standard
  // "value" keyword is ignored, and $ref siblings are ignored in draft-07),
  // so a text payload wrongly matches the reservation branch.
  const payload = {
    version: 3,
    communicationType: 'text',
    supplyOptionsType: 'onPremise',
    text: 'Gibt es noch Traubenzucker?',
    phone: '004916094858168',
    transactionID: '8196b610-9b77-47ab-936e-362cd92ef2aa',
  };
  const { valid } = check(payload);
  assert.equal(valid, false, 'text payload with supplyOptionsType must be rejected');
});

test('[ISSUE D5] email must be limited to 70 characters', () => {
  // Spec: email is "0-70 Stellen". The schema defines no maxLength.
  const longEmail = `${'a'.repeat(70)}@example.de`; // 81 chars
  const { valid } = check(deliveryOrder({ email: longEmail }));
  assert.equal(valid, false, 'email longer than 70 chars must be rejected');
});

test('[ISSUE D6] country must be an ISO 3166-1 alpha-2 code (2 letters)', () => {
  // Spec: "ISO 3166-1 Alpha-2 Code" (e.g. DE). The schema allows maxLength 3,
  // so a 3-letter code like "DEU" is wrongly accepted.
  const { valid } = check(deliveryOrder({ country: 'DEU' }));
  assert.equal(valid, false, '3-letter country code must be rejected');
});

test('[guard D3] delivery order without transactionID must be invalid', () => {
  // Spec: transactionID is mandatory ("ja") for every DispReq type.
  const payload = deliveryOrder();
  delete payload.transactionID;
  const { valid } = check(payload);
  assert.equal(valid, false, 'delivery order without transactionID must be rejected');
});

test('[guard D4] order without supplyOptionsType must be invalid', () => {
  // Spec: supplyOptionsType is mandatory when communicationType = order.
  const payload = deliveryOrder();
  delete payload.supplyOptionsType;
  const { valid } = check(payload);
  assert.equal(valid, false, 'order without supplyOptionsType must be rejected');
});

test('[ISSUE D8] optional name/address fields are allowed on an onPremise order', () => {
  // Spec: for firstname/lastname/address/postcode/city/country the else-case is
  // "nein" (optional), NOT "verboten". An onPremise order MAY carry them.
  const payload = {
    version: 3,
    communicationType: 'order',
    supplyOptionsType: 'onPremise',
    firstname: 'Max',
    lastname: 'Mustermann',
    address: 'Musterstraße 555',
    postcode: '55555',
    city: 'Musterhausen',
    country: 'DE',
    phone: '004916094858168',
    transactionID: '8196b610-9b77-47ab-936e-362cd92ef2aa',
  };
  const { valid, errors } = check(payload);
  assert.equal(
    valid,
    true,
    'optional name/address on onPremise order rejected: ' +
      JSON.stringify(errors, null, 2),
  );
});

test('[ISSUE D8] optional name/address fields are allowed on a text message', () => {
  // Spec: same "nein" (optional) applies to a text message.
  const payload = {
    version: 3,
    communicationType: 'text',
    firstname: 'Max',
    address: 'Musterstraße 555',
    text: 'Gibt es noch Traubenzucker?',
    transactionID: '8196b610-9b77-47ab-936e-362cd92ef2aa',
  };
  const { valid, errors } = check(payload);
  assert.equal(
    valid,
    true,
    'optional name/address on text message rejected: ' +
      JSON.stringify(errors, null, 2),
  );
});

test('[ISSUE D9] hint is forbidden on a text message', () => {
  // Spec: hint is "verboten" when communicationType = text.
  const payload = {
    version: 3,
    communicationType: 'text',
    hint: 'Bitte im Morsecode klingeln',
    text: 'Gibt es noch Traubenzucker?',
    transactionID: '8196b610-9b77-47ab-936e-362cd92ef2aa',
  };
  const { valid } = check(payload);
  assert.equal(valid, false, 'hint on a text message must be rejected');
});

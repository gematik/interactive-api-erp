/*
 * CommunicationReplyPayload.json vs. gemSpec_DM_eRp 2.7.2
 * (A_23877-02 / Tabelle 9, TAB_eRpDM_003 "Nachricht durch Abgebenden übermitteln").
 *
 * Tests tagged [ISSUE ...] currently FAIL against the schema and pinpoint a
 * divergence from the specification; they are expected to pass once the schema
 * is corrected. Tests tagged [control] document behaviour that must keep working.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { compile, loadExample } = require('./helpers');

const validate = compile('CommunicationReplyPayload.json');

function check(payload) {
  const valid = validate(payload);
  return { valid, errors: validate.errors };
}

const TRANSACTION_ID = '8196b610-9b77-47ab-936e-362cd92ef2aa';

test('[control] valid text reply validates', () => {
  const { valid, errors } = check(loadExample('reply', '01_text'));
  assert.equal(valid, true, JSON.stringify(errors, null, 2));
});

test('[control] valid paymentInfo reply (with methods) validates', () => {
  const { valid, errors } = check(loadExample('reply', '07_paymentInfo'));
  assert.equal(valid, true, JSON.stringify(errors, null, 2));
});

test('[ISSUE R1] communicationType "pickupCodeHR" (spec casing) must be valid', () => {
  // Spec Tabelle 9 lists the type as "pickupCodeHR" (lowercase p...code),
  // but the schema pins the const/enum to "pickUpCodeHR" (capital U).
  const payload = {
    version: 3,
    communicationType: 'pickupCodeHR',
    transactionID: TRANSACTION_ID,
    pickupCodeHR: '12315615',
  };
  const { valid, errors } = check(payload);
  assert.equal(
    valid,
    true,
    'spec value "pickupCodeHR" rejected: ' + JSON.stringify(errors, null, 2),
  );
});

test('[ISSUE R1] communicationType "pickupCodeDMC" (spec casing) must be valid', () => {
  const payload = {
    version: 3,
    communicationType: 'pickupCodeDMC',
    transactionID: TRANSACTION_ID,
    pickupCodeDMC: '5346a991-c5c6-49c8-b87b-4cdd255bbde4',
  };
  const { valid, errors } = check(payload);
  assert.equal(
    valid,
    true,
    'spec value "pickupCodeDMC" rejected: ' + JSON.stringify(errors, null, 2),
  );
});

test('[ISSUE R2] paymentInfo must be valid without paymentMethods', () => {
  // Spec: for paymentInfo, paymentMethods is optional ("nein"); only totalAmount
  // is mandatory. The schema wrongly requires paymentMethods.
  const payload = {
    version: 3,
    communicationType: 'paymentInfo',
    transactionID: TRANSACTION_ID,
    totalAmount: 12550,
  };
  const { valid, errors } = check(payload);
  assert.equal(
    valid,
    true,
    'paymentInfo without paymentMethods rejected: ' +
      JSON.stringify(errors, null, 2),
  );
});

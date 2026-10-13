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

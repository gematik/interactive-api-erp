# Communication payload schema tests

Validation tests that compare the two Communication payload JSON schemas against
the gematik specification **gemSpec_DM_eRp** (chapter 2.7):

- [`CommunicationDispReqPayload.json`](../CommunicationDispReqPayload.json) —
  section 2.7.1, `A_23876-01`, TAB_eRpDM_002.
- [`CommunicationReplyPayload.json`](../CommunicationReplyPayload.json) —
  section 2.7.2, `A_23877-02`, TAB_eRpDM_003.

## Running

```sh
cd erp-fd-communications/tests
npm install
npm test
```

The suite uses Ajv (draft-07) and Node's built-in test runner (Node ≥ 18).

## How to read the results

Tests are tagged in their names:

- `[ISSUE …]` — encodes a **spec-correct** expectation that the current schema
  violates. These tests **fail on purpose** to demonstrate the divergence and
  are expected to pass once the schema is fixed.
- `[control]` — a known-valid example payload that must always validate.
- `[guard]` — behaviour that must remain correct after any fix.

## Issues demonstrated

DispReq (2.7.1):

- **D1** — a `text` message cannot validate because the schema root requires
  `supplyOptionsType`, which the spec forbids for `communicationType = text`.
- **D2** — `communicationType` is not actually pinned per `oneOf` branch (the
  non-standard `"value"` keyword and `$ref` siblings are ignored in draft-07),
  so a `text` payload wrongly matches the reservation branch.
- **D5** — `email` has no `maxLength` (spec: max 70).
- **D6** — `country` allows 3 characters (spec: ISO 3166-1 alpha-2, 2 letters).
- **D8** — name/address fields (`firstname`, `lastname`, `address`, `postcode`,
  `city`, `country`) are `nein` (optional), not `verboten`, for onPremise orders
  and text messages, but the branches' `additionalProperties:false` forbade them.
- **D9** — `hint` is `verboten` for `communicationType = text`, but the Message
  branch allowed it.
- **D3/D4** (guards) — `transactionID` / `supplyOptionsType` requirements.

Reply (2.7.2):

- **R1** — discriminator casing: schema uses `pickUpCodeHR` / `pickUpCodeDMC`,
  spec uses `pickupCodeHR` / `pickupCodeDMC`.
- **R2** — `paymentInfo` wrongly requires `paymentMethods` (spec: optional).

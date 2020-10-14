# Context Assert

Collection of assertions mostly for user input and configuration definitions, wrapped in a class so that error messages can be conveniently contextualized.

## Requirements

We are using es6 modules (Node version >= 13.2.0).

See [Announcing core Node.js support for ECMAScript modules](https://medium.com/@nodejs/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663).

## Illustrative Example

```bash
npm install https://github.com/synchronopeia/context-assert
```

```javascript
import ContextAssert from 'context-assert/index.mjs';

const assert = new ContextAssert();

const SCHEMA_DEFS = [{
  fieldId: 'participantId',
  default: '',
}, {
  fieldId: 'lastName',
  colLabel: 'Last Name',
  default: '',
}, {
  fieldId: 'firstName',
  colLabel: 'Fast Name',
  default: '',
}, {
  fieldId: 'lastName', /** oops this ID is repeated */
  colLabel: 'Middle Name',
  default: '',
}];

const checkSchemaDefs = () => {
  assert.setDetail('checking schema defs'); // also included in error message
  try {
    assert.arrayWithRecordProperty(SCHEMA_DEFS, 'default'); // 'default' is required
    assert.arrayWithOptionalRecordLabel(SCHEMA_DEFS, 'colLabel'); // 'label' is optional but must conform to "Label" requirements
    assert.arrayWithRecordId(SCHEMA_DEFS, 'fieldId'); // 'fieldId' is required and must conform to ID requirements
  } catch (err) {
    console.error(err.message);
  }
};

assert.setContext('Illustrative Example'); // included in error.message
checkSchemaDefs();

// In this example, only the last assertion assert.arrayWithRecordId(SCHEMA_DEFS, 'fieldId') fails.

// err.message will be:

// ASSERT_ARRAY_WITH_RECORD_ID_FAIL: expected array of objects with unique string identifer -- assertion context is 'Illustrative Example' (checking schema defs) -- fieldId: 'lastName' is repeated
```

import ContextAssert from './index.mjs';

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

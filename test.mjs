/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */

import test from 'ava';

import ContextAssert from './index.mjs';

const assert = new ContextAssert();

test('number', (t) => {
  assert.setContext('number');
  t.throws(() => assert.number('2'));
  t.throws(() => assert.number(null));
  t.notThrows(() => assert.number(2));
  t.notThrows(() => assert.number(0));
  t.pass();
});

test('numberOrNull', (t) => {
  assert.setContext('numberOrNull');
  t.throws(() => assert.numberOrNull('2'));
  t.notThrows(() => assert.numberOrNull(null));
  t.notThrows(() => assert.numberOrNull(2));
  t.notThrows(() => assert.numberOrNull(0));
  t.pass();
});

test('string', (t) => {
  assert.setContext('string');
  t.throws(() => assert.string(2));
  t.throws(() => assert.string(0));
  t.notThrows(() => assert.string(''));
  t.notThrows(() => assert.string('2'));
  t.pass();
});

test('stringWithSomething', (t) => {
  assert.setContext('stringWithSomething');
  t.throws(() => assert.stringWithSomething(2));
  t.throws(() => assert.stringWithSomething(0));
  t.throws(() => assert.stringWithSomething(''));
  t.notThrows(() => assert.stringWithSomething('2'));
  t.pass();
});

test('array', (t) => {
  assert.setContext('array');
  t.throws(() => assert.array('not an array'));
  t.notThrows(() => assert.array([]));
  t.pass();
});

test('arrayWithSomething', (t) => {
  assert.setContext('arrayWithSomething');
  t.throws(() => assert.arrayWithSomething('not an array'));
  t.throws(() => assert.arrayWithSomething([]));
  t.notThrows(() => assert.arrayWithSomething(['array item']));
  t.pass();
});

test('arrayOfStringValues', (t) => {
  assert.setContext('arrayOfStringValues');
  t.throws(() => assert.arrayOfStringValues('not an array'));
  t.throws(() => assert.arrayOfStringValues([100]));
  t.notThrows(() => assert.arrayOfStringValues(['100']));
  t.notThrows(() => assert.arrayOfStringValues([]));
  t.pass();
});

test('arrayOfNumberValues', (t) => {
  assert.setContext('arrayOfStringValues');
  t.throws(() => assert.arrayOfNumberValues('not an array'));
  t.notThrows(() => assert.arrayOfNumberValues([100]));
  t.throws(() => assert.arrayOfNumberValues([100, null]));
  t.throws(() => assert.arrayOfNumberValues(['100']));
  t.notThrows(() => assert.arrayOfNumberValues([]));
  t.pass();
});

test('arrayOfNumberOrNullValues', (t) => {
  assert.setContext('arrayOfNumberOrNullValues');
  t.throws(() => assert.arrayOfNumberOrNullValues('not an array'));
  t.notThrows(() => assert.arrayOfNumberOrNullValues([100]));
  t.notThrows(() => assert.arrayOfNumberOrNullValues([100, null]));
  t.throws(() => assert.arrayOfNumberOrNullValues(['100']));
  t.notThrows(() => assert.arrayOfNumberOrNullValues([]));
  t.pass();
});

const SCHEMA_DEFS = [{
  fieldId: 'participantId',
  default: '',
}, {
  fieldId: 'lastName',
  colLabel: 'Last Name',
}];

test('arrayWithRecordProperty', (t) => {
  assert.setContext('arrayWithRecordProperty');
  t.throws(() => assert.arrayWithRecordProperty(SCHEMA_DEFS, 'nonProperty'));
  t.notThrows(() => assert.arrayWithRecordProperty(SCHEMA_DEFS, 'fieldId'));
  t.pass();
});

test('arrayWithRecordId', (t) => {
  assert.setContext('arrayWithRecordId');
  t.notThrows(() => assert.arrayWithRecordId(SCHEMA_DEFS, 'fieldId'));
  t.throws(() => assert.arrayWithRecordId(SCHEMA_DEFS.concat({ fieldId: 'first name' }), 'fieldId')); // whitespace
  t.throws(() => assert.arrayWithRecordId(SCHEMA_DEFS.concat({ fieldId: '4WheelDrive' }), 'fieldId')); // leading number
  t.throws(() => assert.arrayWithRecordId(SCHEMA_DEFS.concat({ fieldId: 'lastName' }), 'fieldId')); // repeated id
  t.pass();
});

test('arrayWithOptionalRecordLabel', (t) => {
  assert.setContext('arrayWithOptionalRecordLabel');
  t.notThrows(() => assert.arrayWithOptionalRecordLabel(SCHEMA_DEFS, 'colLabel'));
  t.throws(() => assert.arrayWithOptionalRecordLabel(SCHEMA_DEFS.concat({ colLabel: ' First Name' }), 'colLabel')); // leading / trailing whitespace
  t.throws(() => assert.arrayWithOptionalRecordLabel(SCHEMA_DEFS.concat({ colLabel: 'First  Name' }), 'colLabel')); // consecutive whitespace
  t.throws(() => assert.arrayWithOptionalRecordLabel(SCHEMA_DEFS.concat({ colLabel: 'Last Name' }), 'colLabel')); // repeated label
  t.throws(() => assert.arrayWithOptionalRecordLabel(SCHEMA_DEFS.concat({ colLabel: 'LAST NAME' }), 'colLabel')); // repeated label differing only in case
  t.pass();
});

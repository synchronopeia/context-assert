/**
 * context-assert
 * Collection of assertions mostly for user input, wrapped in a class so that error messages can be conveniently contextualized.
 * @version 0.1.0
 * @module
 */

const ASSERT_NUMBER_FAIL = 'ASSERT_NUMBER_FAIL: expected a number';
const ASSERT_NUMBER_OR_NULL_FAIL = 'ASSERT_NUMBER_OR_NULL_FAIL: expected a number or null';
const ASSERT_STRING_FAIL = 'ASSERT_STRING_FAIL: expected a string';
const ASSERT_STRING_WITH_SOMETHING_FAIL = 'ASSERT_STRING_WITH_SOMETHING_FAIL: expected a non-zero-length string';
const ASSERT_STRING_FROM_DISTINCT_FAIL = 'ASSERT_STRING_FROM_DISTINCT_FAIL: expected a string from a list of distinct possible strings';
const ASSERT_STRING_FROM_DISTINCT_OR_NOTHING_FAIL = 'ASSERT_STRING_FROM_DISTINCT_OR_NOTHING_FAIL: expected a string from a list of distinct possible strings or ""';
const ASSERT_ARRAY_FAIL = 'ASSERT_ARRAY_FAIL: expected an array';
const ASSERT_ARRAY_WITH_SOMETHING_FAIL = 'ASSERT_ARRAY_WITH_SOMETHING_FAIL: expected a non-zero-length array';
const ASSERT_ARRAY_OF_STRING_VALUES_FAIL = 'ASSERT_ARRAY_OF_STRING_VALUES_FAIL: expected an array of strings';
const ASSERT_ARRAY_OF_NUMBER_VALUES_FAIL = 'ASSERT_ARRAY_OF_NUMBER_VALUES_FAIL: expected an array of numbers';
const ASSERT_ARRAY_OF_NUMBER_OR_NULL_VALUES_FAIL = 'ASSERT_ARRAY_OF_NUMBER_VALUES_FAIL: expected an array of number or null types';
const ASSERT_ARRAY_WITH_RECORD_PROPERTY_FAIL = 'ASSERT_ARRAY_WITH_RECORD_PROPERTY_FAIL: expected array of objects with property';
const ASSERT_ARRAY_WITH_RECORD_ID_FAIL = 'ASSERT_ARRAY_WITH_RECORD_ID_FAIL: expected array of objects with unique string identifer';
const ASSERT_ARRAY_WITH_OPTIONAL_RECORD_LABEL_FAIL = 'ASSERT_ARRAY_WITH_OPTIONAL_RECORD_LABEL_FAIL: expected array of objects with unique label';

const WHITESPACE_REGEX = /\s/g;
const REPEATED_WHITESPACE_REGEX = /\s+/g;
const LEADING_NUMBER_REGEX = /^[0-9]/;

export default class {
  constructor() {
    this.context = '';
    this.detail = '';
  }

  setContext(contextArg) {
    this.context = contextArg;
  }

  setDetail(detailArg) {
    this.detail = detailArg;
  }

  fail(errorMessage, arg1) {
    let fullMessage = errorMessage;
    if (this.context) fullMessage += ` -- assertion context is '${this.context}'`;
    if (this.detail) fullMessage += ` (${this.detail})`;
    if (typeof arg1 === 'string') fullMessage += ` -- ${arg1}`;
    throw Error(fullMessage);
  }

  /**
   * Assertions
   */

  /** number */

  number(src) {
    if (typeof src !== 'number') this.fail(ASSERT_NUMBER_FAIL, `'${src}' is not a number.`);
  }

  numberOrNull(src) {
    if (!((typeof src === 'number') || (src === null))) this.fail(ASSERT_NUMBER_OR_NULL_FAIL, `'${src}' is not a number or null.`);
  }

  /** string */

  string(src) {
    if (typeof src !== 'string') this.fail(ASSERT_STRING_FAIL);
  }

  stringWithSomething(src) {
    this.string(src);
    if (!src.length) this.fail(ASSERT_STRING_WITH_SOMETHING_FAIL);
  }

  stringFromDistinct(src, distinctList) {
    this.string(src);
    if (!distinctList.includes(src)) this.fail(ASSERT_STRING_FROM_DISTINCT_FAIL, `'${src}' is not one of ${distinctList.join('|')}`);
  }

  stringFromDistinctOrNothing(src, distinctList) {
    this.string(src);
    if (!distinctList.includes(src)) this.fail(ASSERT_STRING_FROM_DISTINCT_OR_NOTHING_FAIL, `'${src}' is not "" or one of ${distinctList.join('|')}`);
  }

  /** Array */

  array(src) {
    if (!Array.isArray(src)) this.fail(ASSERT_ARRAY_FAIL);
  }

  arrayWithSomething(src) {
    if (!(Array.isArray(src) && src.length)) this.fail(ASSERT_ARRAY_WITH_SOMETHING_FAIL);
  }

  arrayOfStringValues(src) {
    this.array(src);
    const foundIndex = src.findIndex((item) => (typeof item !== 'string'));
    if (foundIndex !== -1) this.fail(ASSERT_ARRAY_OF_STRING_VALUES_FAIL, `'${src[foundIndex]}' at index ${foundIndex} is not a string.`);
  }

  arrayOfNumberValues(src) {
    this.array(src);
    const foundIndex = src.findIndex((item) => (typeof item !== 'number'));
    if (foundIndex !== -1) this.fail(ASSERT_ARRAY_OF_NUMBER_VALUES_FAIL, `'${src[foundIndex]}' at index ${foundIndex} is not a number.`);
  }

  arrayOfNumberOrNullValues(src) {
    this.array(src);
    const foundIndex = src.findIndex((item) => (!((typeof item === 'number') || (item === null))));
    if (foundIndex !== -1) this.fail(ASSERT_ARRAY_OF_NUMBER_OR_NULL_VALUES_FAIL, `'${src[foundIndex]}' at index ${foundIndex} is not a number or null.`);
  }

  arrayWithRecordProperty(src, key) {
    this.arrayWithSomething(src);
    const index = src.findIndex((ele) => !Object.prototype.hasOwnProperty.call(ele, key));
    if (index !== -1) this.fail(ASSERT_ARRAY_WITH_RECORD_PROPERTY_FAIL, `property '${key}' is missing from index ${index}`);
  }

  arrayWithRecordId(src, key) {
    this.arrayWithRecordProperty(src, key);
    const list = src.map((ele) => ele[key]);
    // cannot include whitespace
    let foundItem = list.find((item) => (item.length !== item.replace(WHITESPACE_REGEX, '').length));
    if (foundItem) this.fail(ASSERT_ARRAY_WITH_RECORD_ID_FAIL, `${key}: '${foundItem}' is an invalid id (it contains whitespace)`);
    // cannot have leading number
    foundItem = list.find((item) => (item.match(LEADING_NUMBER_REGEX)));
    if (foundItem) this.fail(ASSERT_ARRAY_WITH_RECORD_ID_FAIL, `${key}: '${foundItem}' is an invalid id (it has a leading number)`);
    // cannot be repeated
    foundItem = list.find((item, index) => (list.indexOf(item, index + 1) !== -1));
    if (foundItem) this.fail(ASSERT_ARRAY_WITH_RECORD_ID_FAIL, `${key}: '${foundItem}' is repeated`);
  }

  arrayWithOptionalRecordLabel(src, key) {
    this.arrayWithSomething(src);
    const list = src.filter((ele) => Object.prototype.hasOwnProperty.call(ele, key)).map((ele) => ele[key]);
    // disallowed white space (anything but ' ')
    let foundItem = list.find((item) => (item !== item.replace(WHITESPACE_REGEX, ' ')));
    if (foundItem) this.fail(ASSERT_ARRAY_WITH_OPTIONAL_RECORD_LABEL_FAIL, `${key}: '${foundItem}' includes whitespace that is not a plain space`);
    // consecutive spaces
    foundItem = list.find((item) => (item.length !== item.replace(REPEATED_WHITESPACE_REGEX, ' ').length));
    if (foundItem) this.fail(ASSERT_ARRAY_WITH_OPTIONAL_RECORD_LABEL_FAIL, `${key}: '${foundItem}' includes consecutive spaces`);
    // leading / trailing spaces
    foundItem = list.find((item) => (item.length !== item.trim().length));
    if (foundItem) this.fail(ASSERT_ARRAY_WITH_OPTIONAL_RECORD_LABEL_FAIL, `${key}: '${foundItem}' includes a leading and/or trailing space`);
    // repeated item
    foundItem = list.find((item, index) => (list.indexOf(item, index + 1) !== -1));
    if (foundItem) this.fail(ASSERT_ARRAY_WITH_OPTIONAL_RECORD_LABEL_FAIL, `'${key}: ${foundItem}' is repeated`);
    // case-insensitive repeated item
    const lowerCaseList = list.map((item) => item.toLowerCase());
    const foundIndex = lowerCaseList.findIndex((item, index) => (lowerCaseList.indexOf(item, index + 1) !== -1));
    if (foundIndex !== -1) this.fail(ASSERT_ARRAY_WITH_OPTIONAL_RECORD_LABEL_FAIL, `${key}: '${list[foundIndex]}' differs from another entry only in case`);
  }
}

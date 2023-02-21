const { validate } = require('../validation.js');
const writableConfig = require('../writable-config.json');

test('string  for Data.SomeString', () => {
	const fieldName = 'Data.SomeString';
	let value;
	let result;
	value = 'test';
	result = validate(fieldName, value);
	expect(result).toBe(true);
});

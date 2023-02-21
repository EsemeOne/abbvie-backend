const tickLog = require('tick-log');
const fa = require('../frontend-authorization.js');

test('frontend-authorization exists', () => {
	let result;
	result = fa('Admin');
	expect(result).toBeTruthy();
	let oneItem = result.filter((item) => { return (item.code === 4001) });
	expect(oneItem.length).toBe(1);
	expect(oneItem[0]).toEqual({"code": 4001, "view": "HamburgerMenuView", "function": "Home"});
});

test('frontend-authorization does not exist', () => {
	let result;
	result = fa('Some Wrong Role');
	expect(result).toBeFalsy();
});
// master file is the one under the ./backend/validation folder

const writableConfig = require('./writable-config.json');

const validate = (fieldName, value) => {
	let fieldNameArr = fieldName.split('.');
	let fieldNameArr2 = fieldNameArr.map((item) => {
		return Number(item) ? "{i}" : item;
	});
	let fieldName2 = fieldNameArr2.join('.');
	const fieldConfig_ = writableConfig.filter((row) => row.name === fieldName2);
	if (fieldConfig_.length !== 1) return false; // better to stop in panic mode so the field name can be added / corrected in the configuration;
	const fieldConfig = fieldConfig_[0];
	if (!(fieldConfig?.dataValidation)) return true;
	let values;
	if (fieldConfig.list) values = value.split(',');
	else values = [value];
	for(let i = 0; i < values.length; i++){
		let v = values[i];
		const dataValidation = fieldConfig.dataValidation.replace(/\[VALUE\]/g, v); // this line came with copilot
		let evalResult;
		try {
			evalResult = (eval(dataValidation));
		} catch (error) {
			return false;
		}
		if (!(evalResult)) return false;		
	}
	return true;
}

module.exports = {
	validate
}
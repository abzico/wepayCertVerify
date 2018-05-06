const crypto = require('crypto');

// generate signature from input variadic parameters
// input is in key-value pair so number of input variables will be in even
// key parameter needs to be in string type only
// note: use only 'md5' as method, for sha256 even though test case result matches, but it failed
function signgen(method, key, ...args) {
	// create tuples of key-value pair
  let tuples = [];

	for (let i=0; i<args.length; i+=2) {
		tuples.push({ key: args[i], value: args[i+1] });	
	}

	// sort lexicographically inplace
	sortLex(tuples);

	// form stringA output
	let stringA = '';
	for (let i=0; i<tuples.length; i++) {
		stringA += tuples[i].key + '=' + tuples[i].value + '&';
	}

	// append with key
	let stringSignTemp = stringA + 'key=' + key;

	let sign;
	// proceeed with input method
	if (method === 'md5') {
		// hash in md5
		sign = md5(stringSignTemp);
	}
	else {
		// hash in sha256
		sign = sha256(stringSignTemp, key);
	}

	return sign.toUpperCase();
}

function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

function sha256(message, key) {
	return crypto.createHmac('sha256', key).update(message).digest('hex');
}

function sortLex(tuples) {
	tuples.sort(function(a,b) { return a.key.localeCompare(b.key); });
}

module.exports = {
	generate: signgen
}

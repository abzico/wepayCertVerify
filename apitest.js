const https = require('https');
const fs = require('fs');
const randomstr = require('./randomstr.js');
const signgen = require('./signgen.js');

// KEY is set via merchant platform
// 微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
const KEY = '<your merchant platform key here>';
// check your email for your merchant number detail
const MCH_ID = '<your merchant number here>';

let randomStr = randomstr();
let sign = signgen.generate('md5', KEY, 'mch_id', MCH_ID, 'nonce_str', randomStr);

// form data in xml format
let postData = `<xml>
<mch_id>${MCH_ID}</mch_id>
<nonce_str>${randomStr}</nonce_str>
<sign>${sign}</sign>
</xml>`;

// use apitest endpoint, if it works it should work as well for api endpoint
// use .p12 file in which we need to specify passphrase as well
const options = {
	hostname: 'apitest.mch.weixin.qq.com',
	path: '/sandboxnew/pay/getsignkey',
	port: 443,
	method: 'POST',
	pfx: fs.readFileSync('/your-path-to-your-merchant-platform-certificate/apiclient_cert.p12'),
	passphrase: MCH_ID,
	body: postData
};

const req = https.request(options, (res) => {
	res.on('data', (d) => {
		process.stdout.write(d);
	});
});

req.on('error', (e) => {
	console.log(e);
});

req.write(postData);
req.end();

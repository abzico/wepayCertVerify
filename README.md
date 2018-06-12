[![donate button](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat)](https://github.com/abzico/donate)

# wepayCertVerify

WeChat Payment HTTPS Server Certificate Verification - a repo to verify whether your server supports new certificate deployed by Tencent

# Why?

From [offical anouncement](https://pay.weixin.qq.com/index.php/public/cms/content_detail?lang=zh&id=56602) from Tencent about it will be enforcing new certificates for WeChat Payment by updating its own root CA certificates to be DigiCert, and set deadline upto 29 May 2018, we need to proceed with update according to its guideline.

Basically what we need to do is

1. Verify whether we do need a further actions to install actual root CA certificates from Wechat Payment or not, if not which means it **passed** the verification, then we have no need to do anything further. This repo follows guideline as seen [here](https://pay.weixin.qq.com/wiki/doc/api/micropay.php?chapter=23_4) for its verification.
2. If not, then we just need to grab root CA certificates as found [here](https://pay.weixin.qq.com/wiki/doc/api/micropay.php?chapter=23_4) then install them onto your server.

So this repo has code to help you verify for 1. If you need to perform 2, then continue reading to find instruction on how to install certificate on your server in this README file.

# How to Verify?

* Clone the repo to your computer
* Configure your merchant platform key, and merchant number in `apitest.js`. See its corresponding comments inside source file.
* Execute `node apitest.js`

If you see `success` as seen in following similar result, you're good to go and no need to perform 2.

```xml
<xml>
    <return_code><![CDATA[SUCCESS]]></return_code>
    <return_msg><![CDATA[ok]]></return_msg>
    <sandbox_signkey><![CDATA[aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa]]></sandbox_signkey>
</xml>
```

in which value inside `sandbox_signkey` is 32 hex-char that you will be using in other payment API.

# Beware!!

* `apitest.js` file is meant to be executed on your system as a testing script. You modify its source code for `KEY` and `MCH_ID` but you should **never** commit such changes back to your or upstream repository. If you found some enchancements that you want to modify, please make sure to not commit your `KEY` and `MCH_ID` back to repo.

# How to List & Install Root CA Certificates On Your Server?

## Ubuntu 16.04

### List

You can list all of root CA certificates by using the following command (thanks to [Stephane Chazelas](https://unix.stackexchange.com/a/97252/206440))

```shell
awk -v cmd='openssl x509 -noout -subject' '
    /BEGIN/{close(cmd)};{print | cmd}' < /etc/ssl/certs/ca-certificates.crt
```

### Install

Follow insructions [here](https://askubuntu.com/a/94861/399650).

> In short, you need to manage to get `.crt` file (convertable from `.pem` file) then let the system knows path to such certificates.


## CentOS 7

### List

You can manually take a peek at `/etc/ssl/certs/ca-bundle.crt` then search for the name of certificate there exactly and namely "DigiCert Global Root CA" or "Baltimore CyberTrust Root CA". If one of either the twos is found, you're most likely good to go. Just make sure with step 1. again to be 100% sure.

Otherwise, we could follow the similar approach done with Ubuntu above by using the following command (thanks to [Nathan Basanese](https://unix.stackexchange.com/a/363309/206440))

```shell
$ awk -v cmd='openssl x509 -noout -subject' '
    /BEGIN/{close(cmd)};{print | cmd}' < /etc/ssl/certs/ca-bundle.crt
```

### Install

Follow instructions [here](https://unix.stackexchange.com/a/363309/206440).

# License

Abzi.co. MIT

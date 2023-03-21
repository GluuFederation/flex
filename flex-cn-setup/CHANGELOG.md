# Changelog

## [1.0.10](https://github.com/GluuFederation/flex/compare/flex-cn-setup-v1.0.9...flex-cn-setup-v1.0.10) (2023-03-16)


### Bug Fixes

* add cn license enforcment to chart ([55fb0c9](https://github.com/GluuFederation/flex/commit/55fb0c97428a3ec704e80558679a7e9d7f88c42c))
* prepare for 5.0.10 release ([1ffcbc7](https://github.com/GluuFederation/flex/commit/1ffcbc74d837e7a037d6cff71d990573d04bba7b))

## [1.0.9](https://github.com/GluuFederation/flex/compare/flex-cn-setup-v1.0.8...flex-cn-setup-v1.0.9) (2023-03-09)


### Bug Fixes

* prepare for 5.0.0-9 release ([716d309](https://github.com/GluuFederation/flex/commit/716d309350f5713b96f482dde9e0a543e5e62286))

## [1.0.8](https://github.com/GluuFederation/flex/compare/flex-cn-setup-v1.0.7...flex-cn-setup-v1.0.8) (2023-03-02)


### Bug Fixes

* prepare for 5.0.0-8 release ([29e0cbb](https://github.com/GluuFederation/flex/commit/29e0cbb5166d83268ab9c3ee3c5f3e2bc4dd1489))

## [1.0.7](https://github.com/GluuFederation/flex/compare/flex-cn-setup-v1.0.5...flex-cn-setup-v1.0.7) (2023-02-22)


### Features

* **docker-casa:** enable prefix and group for stdout logs ([#696](https://github.com/GluuFederation/flex/issues/696)) ([bdb0f06](https://github.com/GluuFederation/flex/commit/bdb0f06c730aa2878cd05d70446574cc4e893550))


### Bug Fixes

* add init containers for adjusting ownership on upgrade ([291566e](https://github.com/GluuFederation/flex/commit/291566e2e7117c6f11ce24ef0b1330feb0cdef4f))
* add init containers for adjusting ownership on upgrade ([e157fcb](https://github.com/GluuFederation/flex/commit/e157fcb359350014b79767a8dcb03eaddcc6ca36))
* add init containers for adjusting ownership on upgrade ([c54f598](https://github.com/GluuFederation/flex/commit/c54f598679a6e9c3a44ae00807a09a0d26e17c59))
* add stdout log prefix ([9853283](https://github.com/GluuFederation/flex/commit/9853283b6a037196ca618d4c0ed071a204a7543f))
* add stdout log prefix ([fc046ba](https://github.com/GluuFederation/flex/commit/fc046baf2330a76709416994ffbae10f81f46eec))
* extend fido2 appLoggers ([2757139](https://github.com/GluuFederation/flex/commit/27571390a6b0534e13253b86bd6a039f1d854a68))
* idp healthcheck (idp not configured yet) ([cf221b9](https://github.com/GluuFederation/flex/commit/cf221b9842f4578537b0f300c125e1cd867cc41f))
* increase config-api resource requirements ([f046679](https://github.com/GluuFederation/flex/commit/f0466794e31002c9e61074352b8f891f1168632b))
* prepare for 5.0.0-7 release ([7f96937](https://github.com/GluuFederation/flex/commit/7f9693729156b04367b85d0d44a4022a52d53417))
* prepare for helm chart 5.0.11 ([726ad05](https://github.com/GluuFederation/flex/commit/726ad05ba5aabcb24d4a73ec5420bc54c9bfc912))
* update configmap ENVs ([acda6a5](https://github.com/GluuFederation/flex/commit/acda6a50dae83d53550c6bd9f20c09592e3048cf))


### Documentation

* add initial eks tutorial ([1579572](https://github.com/GluuFederation/flex/commit/157957291d5443237712627f24ac843deed961a9))
* add initial k8s docs ([3562826](https://github.com/GluuFederation/flex/commit/3562826b9ae8fd54fdc04447e03abbd421c66aa5))

## [1.0.5](https://github.com/GluuFederation/flex/compare/flex-cn-setup-v1.0.4...flex-cn-setup-v1.0.5) (2022-12-08)


### Features

* add aws secret manager https://github.com/JanssenProject/jans/issues/3026 ([48418cd](https://github.com/GluuFederation/flex/commit/48418cd351655a48c650075a6d60601c368a403d))
* **charts:** add pdb and topology spread constrants ([6191c47](https://github.com/GluuFederation/flex/commit/6191c478d02905e5da46b05ab15720c929677d63))


### Bug Fixes

* getting ready for a release ([a0de091](https://github.com/GluuFederation/flex/commit/a0de091ca26f2c38378e5b0252ab680cb1e3cd88))

## 1.0.4 (2022-11-08)


### Features

* **admin-ui:** resolved merge conflict [#412](https://github.com/GluuFederation/flex/issues/412) ([ea5c1e6](https://github.com/GluuFederation/flex/commit/ea5c1e64f7726d947b7bf9fb6cc18f964cb2071c))
* **admin-ui:** reviewed previously updated dependencies [#416](https://github.com/GluuFederation/flex/issues/416) ([ab81760](https://github.com/GluuFederation/flex/commit/ab81760457727c7a5890d89c2f2ec3dabdeb12eb))
* **helm-charts:** allow emitting logs for preStop hook ([2cdd90f](https://github.com/GluuFederation/flex/commit/2cdd90f900050d8c4999f8e90bb63706cefc525e))


### Bug Fixes

* add cbSqlDbSchema propetry to helm chart ([2dac5c8](https://github.com/GluuFederation/flex/commit/2dac5c884925cf68a3c562142191a27b945e1ca6))
* add quote on prometheous env ([c4a20b9](https://github.com/GluuFederation/flex/commit/c4a20b907a4a1d6fece8b5eb8b90a8f98c7fbde6))
* add rewrite rule directly in the default nginx conf of the docker admin ui ([#524](https://github.com/GluuFederation/flex/issues/524)) ([5798ee9](https://github.com/GluuFederation/flex/commit/5798ee9f6320602d756cb2d33fe297200d2231dd))
* allow overriding istio gateway ([280f432](https://github.com/GluuFederation/flex/commit/280f432343564f78db4702110b6fbc562625e12a))
* **charts:** fix values.yaml schema ([09e8f14](https://github.com/GluuFederation/flex/commit/09e8f14c65cb8024aab95da7ecf5295ed0e20b4b))
* getting ready to release 5.0.0-3 ([e8f3ecc](https://github.com/GluuFederation/flex/commit/e8f3eccc3804a0bcc6075d755dad209b188db444))
* helm chart nil SQLSCHEMA property ([0a87349](https://github.com/GluuFederation/flex/commit/0a87349ac9d858a45406437c1e509a887854dc52))
* typos in istio vs ([1c48e40](https://github.com/GluuFederation/flex/commit/1c48e4034492c0961a2e941f13987869c2a3f37f))
* update cronjob api versions ([c572384](https://github.com/GluuFederation/flex/commit/c5723843caa73a306aca25a297173d8a862845e6))


### Miscellaneous Chores

* release 0.1.1 ([fa0f8a3](https://github.com/GluuFederation/flex/commit/fa0f8a3d951c34317925ef8b147d35110f5916c0))
* release 0.1.2 ([0185ce9](https://github.com/GluuFederation/flex/commit/0185ce9c9c7504f145980ffe7af104baaa34b81c))
* release 5.0.0-2 ([06c6e64](https://github.com/GluuFederation/flex/commit/06c6e64f43a7c98bcb04ba1d48ec97044c19d75d))

## [0.1.2](https://github.com/GluuFederation/flex/compare/flex-cn-setup-v0.1.1...flex-cn-setup-v0.1.2) (2022-08-31)


### Bug Fixes

* add quote on prometheous env ([c4a20b9](https://github.com/GluuFederation/flex/commit/c4a20b907a4a1d6fece8b5eb8b90a8f98c7fbde6))


### Miscellaneous Chores

* release 0.1.2 ([0185ce9](https://github.com/GluuFederation/flex/commit/0185ce9c9c7504f145980ffe7af104baaa34b81c))

## 0.1.1 (2022-07-14)


### Features

* add applogers for the admin ui plugin ([1185372](https://github.com/GluuFederation/flex/commit/11853726e86193484fbcdb5a0b5bbdb0d6728031))
* add applogers for the admin ui plugin ([1185372](https://github.com/GluuFederation/flex/commit/11853726e86193484fbcdb5a0b5bbdb0d6728031))
* add applogers for the admin ui plugin ([5208e19](https://github.com/GluuFederation/flex/commit/5208e1993a76042ac50f2513f62e6bd37b9e824e))
* add applogers for the admin ui plugin to values schema ([873dc55](https://github.com/GluuFederation/flex/commit/873dc5546cbbfe998bbcd5ef11dbea35728ff24d))
* add prometheus jmx ([#261](https://github.com/GluuFederation/flex/issues/261)) ([867a031](https://github.com/GluuFederation/flex/commit/867a03199d1ed2e79b596dd7bf6a414eb73544fc))
* admin-ui updated dependencies and manifests ([#208](https://github.com/GluuFederation/flex/issues/208)) ([57c5f12](https://github.com/GluuFederation/flex/commit/57c5f12ea2b6cce026de41b66cd04720bc203fa2))
* resolve conflict ([92b462d](https://github.com/GluuFederation/flex/commit/92b462d40e1603412985f90f77577b6bbda97c12))


### Bug Fixes

* add app loggers for client-api ([9e4d631](https://github.com/GluuFederation/flex/commit/9e4d6315ed2bc13013470e26c7470fb39b3cec24))
* alb setup ([e703c4b](https://github.com/GluuFederation/flex/commit/e703c4b62e60d3cd299ea84f471417290987bdef))
* **chart:** fix probes for admin-ui ([a110323](https://github.com/GluuFederation/flex/commit/a11032378f150c4c878ffc38d9b1b0d7353813ec))
* **chart:** fix typo ([9079bb5](https://github.com/GluuFederation/flex/commit/9079bb5c6d59f669e03ac8fb3ebd2e061dd4c064))
* disallow override of resources if opendj is not installed ([7f3ae75](https://github.com/GluuFederation/flex/commit/7f3ae755c238e921bd5aa95e57faea52d9e7388b))
* remove casa env ([bd65442](https://github.com/GluuFederation/flex/commit/bd6544257fd04a71aae9ce911acd2f7a66519b16))
* remove ldap multi cluster and update base images ([982473c](https://github.com/GluuFederation/flex/commit/982473ce5ec05c22b4c964c7c1e966256f1b8a4e))

## 0.1.0 (2022-03-15)


### Features

* add applogers for the admin ui plugin ([1185372](https://github.com/GluuFederation/flex/commit/11853726e86193484fbcdb5a0b5bbdb0d6728031))
* add applogers for the admin ui plugin ([1185372](https://github.com/GluuFederation/flex/commit/11853726e86193484fbcdb5a0b5bbdb0d6728031))
* add applogers for the admin ui plugin ([5208e19](https://github.com/GluuFederation/flex/commit/5208e1993a76042ac50f2513f62e6bd37b9e824e))
* add applogers for the admin ui plugin to values schema ([873dc55](https://github.com/GluuFederation/flex/commit/873dc5546cbbfe998bbcd5ef11dbea35728ff24d))


### Bug Fixes

* alb setup ([e703c4b](https://github.com/GluuFederation/flex/commit/e703c4b62e60d3cd299ea84f471417290987bdef))
* **chart:** fix probes for admin-ui ([a110323](https://github.com/GluuFederation/flex/commit/a11032378f150c4c878ffc38d9b1b0d7353813ec))
* **chart:** fix typo ([9079bb5](https://github.com/GluuFederation/flex/commit/9079bb5c6d59f669e03ac8fb3ebd2e061dd4c064))
* prep for automatic chart generation ([a24cec3](https://github.com/GluuFederation/flex/commit/a24cec37c19173084ccf3dd7311adb80c1a915d4))
* prep for automatic chart generation ([a24cec3](https://github.com/GluuFederation/flex/commit/a24cec37c19173084ccf3dd7311adb80c1a915d4))
* prep for automatic chart generation ([b6e8cc7](https://github.com/GluuFederation/flex/commit/b6e8cc70eda8bcf020e923d32c1b0eb64d9e2738))

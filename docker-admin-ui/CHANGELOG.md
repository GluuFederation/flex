# Changelog

## [1.0.8-1](https://github.com/GluuFederation/flex/compare/docker-admin-ui-v1.0.7-1...docker-admin-ui-v1.0.8-1) (2023-03-02)


### Bug Fixes

* prepare for 5.0.0-8 release ([29e0cbb](https://github.com/GluuFederation/flex/commit/29e0cbb5166d83268ab9c3ee3c5f3e2bc4dd1489))

## [1.0.7-1](https://github.com/GluuFederation/flex/compare/docker-admin-ui-v1.0.5-1...docker-admin-ui-v1.0.7-1) (2023-02-22)


### Features

* **docker-admin-ui:** save admin-ui config into persistence ([#674](https://github.com/GluuFederation/flex/issues/674)) ([6bc9763](https://github.com/GluuFederation/flex/commit/6bc9763b4c86ba2ea3023d4b27c2631bf11af1d5))


### Bug Fixes

* docker-admin-ui/Dockerfile to reduce vulnerabilities ([#758](https://github.com/GluuFederation/flex/issues/758)) ([b066b6a](https://github.com/GluuFederation/flex/commit/b066b6aead9f1a75b6999151fd8a72dd8739fb6f))
* extend fido2 appLoggers ([2757139](https://github.com/GluuFederation/flex/commit/27571390a6b0534e13253b86bd6a039f1d854a68))
* prepare for 5.0.0-7 release ([7f96937](https://github.com/GluuFederation/flex/commit/7f9693729156b04367b85d0d44a4022a52d53417))

## [1.0.5-1](https://github.com/GluuFederation/flex/compare/docker-admin-ui-v1.0.4-1...docker-admin-ui-v1.0.5-1) (2022-12-08)


### Bug Fixes

* docker-admin-ui/Dockerfile to reduce vulnerabilities ([#613](https://github.com/GluuFederation/flex/issues/613)) ([81f7fe3](https://github.com/GluuFederation/flex/commit/81f7fe3cb58eaf0a62a370d1afc35817fc86135c))
* getting ready for a release ([a0de091](https://github.com/GluuFederation/flex/commit/a0de091ca26f2c38378e5b0252ab680cb1e3cd88))

## 1.0.4-1 (2022-11-08)


### Features

* **admin-ui:** resolved merge conflict [#412](https://github.com/GluuFederation/flex/issues/412) ([ea5c1e6](https://github.com/GluuFederation/flex/commit/ea5c1e64f7726d947b7bf9fb6cc18f964cb2071c))
* **docker-admin-ui:** add support for plugins installation ([#319](https://github.com/GluuFederation/flex/issues/319)) ([f660fb8](https://github.com/GluuFederation/flex/commit/f660fb805c6f67439c5952a393ad1e192a14d342))
* **image:** add authentication method selection for admin-ui image ([#540](https://github.com/GluuFederation/flex/issues/540)) ([d97d10d](https://github.com/GluuFederation/flex/commit/d97d10d28e2881e8cc71dad28c2c4fabaff164af))
* **image:** use admin-ui client encoded secret to render properties ([#567](https://github.com/GluuFederation/flex/issues/567)) ([31e9142](https://github.com/GluuFederation/flex/commit/31e9142c887d4cd8d2be1f1dc7b83a21ff23fb2b))


### Bug Fixes

* add rewrite rule directly in the default nginx conf of the docker admin ui ([#524](https://github.com/GluuFederation/flex/issues/524)) ([5798ee9](https://github.com/GluuFederation/flex/commit/5798ee9f6320602d756cb2d33fe297200d2231dd))
* docker-admin-ui/Dockerfile to reduce vulnerabilities ([a2050c8](https://github.com/GluuFederation/flex/commit/a2050c8dba1154d66cb09a8ea8a0152440d1eb9e))
* getting ready to release 5.0.0-3 ([e8f3ecc](https://github.com/GluuFederation/flex/commit/e8f3eccc3804a0bcc6075d755dad209b188db444))
* **image:** add missing openapi-merge-cli executable ([#526](https://github.com/GluuFederation/flex/issues/526)) ([c14b1f4](https://github.com/GluuFederation/flex/commit/c14b1f48b6fa05675b80169a7ecfe98be42fbea1))
* **image:** admin UI regressions ([#537](https://github.com/GluuFederation/flex/issues/537)) ([b466435](https://github.com/GluuFederation/flex/commit/b466435cc3c230c658c439cba21665b29a40271d))


### Miscellaneous Chores

* release 1.0.0-1 ([6463768](https://github.com/GluuFederation/flex/commit/64637684b9a9276dc53d62cbee116415d1b47d7c))
* release 1.0.1-1 ([366d4b8](https://github.com/GluuFederation/flex/commit/366d4b8f25c6722973fd2f8376f596ccb2b57c08))
* release 5.0.0-2 ([06c6e64](https://github.com/GluuFederation/flex/commit/06c6e64f43a7c98bcb04ba1d48ec97044c19d75d))

## [1.0.1-1](https://github.com/GluuFederation/flex/compare/docker-admin-ui-v1.0.0-1...docker-admin-ui-v1.0.1-1) (2022-08-31)


### Features

* **docker-admin-ui:** add support for plugins installation ([#319](https://github.com/GluuFederation/flex/issues/319)) ([f660fb8](https://github.com/GluuFederation/flex/commit/f660fb805c6f67439c5952a393ad1e192a14d342))


### Bug Fixes

* docker-admin-ui/Dockerfile to reduce vulnerabilities ([a2050c8](https://github.com/GluuFederation/flex/commit/a2050c8dba1154d66cb09a8ea8a0152440d1eb9e))


### Miscellaneous Chores

* release 1.0.1-1 ([366d4b8](https://github.com/GluuFederation/flex/commit/366d4b8f25c6722973fd2f8376f596ccb2b57c08))

## 1.0.0-1 (2022-07-14)


### Features

* admin-ui updated dependencies and manifests ([#208](https://github.com/GluuFederation/flex/issues/208)) ([57c5f12](https://github.com/GluuFederation/flex/commit/57c5f12ea2b6cce026de41b66cd04720bc203fa2))
* introduce new hybrid persistence mapping ([#250](https://github.com/GluuFederation/flex/issues/250)) ([473abdc](https://github.com/GluuFederation/flex/commit/473abdc6c4e4fd6aa1fc3555f906b43e70ce9fb9))


### Bug Fixes

* add specific permissions for serverless runs ([fdf9c7b](https://github.com/GluuFederation/flex/commit/fdf9c7b8fd377cd8a7457252af5d1d0ebc05d07f))
* docker-admin-ui/Dockerfile to reduce vulnerabilities ([#164](https://github.com/GluuFederation/flex/issues/164)) ([fe01bcb](https://github.com/GluuFederation/flex/commit/fe01bcb3d46311355b15a37b655253ca17997358))
* image updater ([92d5fb4](https://github.com/GluuFederation/flex/commit/92d5fb4c2e2c01b3c745279a5c354631b5e51486))
* **image:** conform to nginx filesystem structure ([c5cf5a9](https://github.com/GluuFederation/flex/commit/c5cf5a9b3affc76ccf90a21f44644db6cad7995b))
* **image:** update admin-ui image assets ([b92bcc6](https://github.com/GluuFederation/flex/commit/b92bcc6c4380e1aaec63e0939160cd744ffffc4a))
* **image:** update admin-ui image assets ([b92bcc6](https://github.com/GluuFederation/flex/commit/b92bcc6c4380e1aaec63e0939160cd744ffffc4a))
* **image:** update image manifests ([7e48528](https://github.com/GluuFederation/flex/commit/7e48528b11013e1b4f40a82d26846ff079dd6302))
* permission on `/etc/jans` folder ([e2f2ca0](https://github.com/GluuFederation/flex/commit/e2f2ca03571c843725ed2174f8e7e5cc6fcd7653))


### Miscellaneous Chores

* prepare release 1.0.0-0 ([68c02f8](https://github.com/GluuFederation/flex/commit/68c02f86c98cdee46566324cb3659f1417b4b869))
* release 1.0.0-1 ([6463768](https://github.com/GluuFederation/flex/commit/64637684b9a9276dc53d62cbee116415d1b47d7c))

## 1.0.0-0 (2022-03-15)


### Bug Fixes

* add specific permissions for serverless runs ([fdf9c7b](https://github.com/GluuFederation/flex/commit/fdf9c7b8fd377cd8a7457252af5d1d0ebc05d07f))
* image updater ([92d5fb4](https://github.com/GluuFederation/flex/commit/92d5fb4c2e2c01b3c745279a5c354631b5e51486))
* **image:** conform to nginx filesystem structure ([c5cf5a9](https://github.com/GluuFederation/flex/commit/c5cf5a9b3affc76ccf90a21f44644db6cad7995b))
* **image:** update admin-ui image assets ([b92bcc6](https://github.com/GluuFederation/flex/commit/b92bcc6c4380e1aaec63e0939160cd744ffffc4a))
* **image:** update admin-ui image assets ([b92bcc6](https://github.com/GluuFederation/flex/commit/b92bcc6c4380e1aaec63e0939160cd744ffffc4a))
* **image:** update image manifests ([7e48528](https://github.com/GluuFederation/flex/commit/7e48528b11013e1b4f40a82d26846ff079dd6302))


### Miscellaneous Chores

* prepare release 1.0.0-0 ([68c02f8](https://github.com/GluuFederation/flex/commit/68c02f86c98cdee46566324cb3659f1417b4b869))

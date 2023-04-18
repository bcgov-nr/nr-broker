# NR Broker

NR Broker handles the business logic of authenticating and validating requests for automated processes to access secrets.

NR Broker is built using the [Nest](https://github.com/nestjs/nest) framework.

## Dev setup

You must have mongosh, node and podman installed. Run the following command to setup the node dependencies.

```bash
$ npm ci
```

### Setup setenv-common.sh

A template for [setenv-common.sh](./scripts/setenv-common.sh.tmp) is provided. A script file like that one needs to be copied to ./scripts/setenv-common.sh. The other scripts rely on this file to set their environment varibles.

### Setup mongodb

```bash
# Start up local mongodb
podman run \
  -p 27017:27017 \
  --name broker-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
	-e MONGO_INITDB_ROOT_PASSWORD=secret \
  -d mongo
```

### Setup vault
```bash
# Start up local vault
$ podman run -p 8200:8200 --cap-add=IPC_LOCK -e 'VAULT_DEV_ROOT_TOKEN_ID=myroot' -d --name=broker-vault vault
# Configure the local vault with basic setup
$ ./scripts/vault-setup.sh
# Configure the local mongo with basic setup
$ ./scripts/mongo-setup.sh
```

## Running the server

This assumes mongodb and vault are running locally.

```bash
# ENV setup
$ source ./scripts/setenv-backend-dev.sh

# Run server in watch mode
$ npm run start:dev
```

If you want to do end-to-end testing of the auditing then you need to request the Fluentbit token from your production vault and start the server using envconsul.

```bash
$ source ./scripts/setenv-backend-dev.sh kinesis

# Watch mode. The env-prod.hcl file is a copy of env.hcl with production values.
$ envconsul -config=env-prod.hcl npm run start:dev
```

### Connect to MongoDB

```
mongosh -u mongoadmin -p secret --authenticationDatabase admin brokerDB
```

#### Wiping graph database

If at any time you need to wipe the graph database, you can drop the tables by using mongosh and then reinstall.

```
brokerDB> db.service.drop(); db.vertex.drop(); db.edge.drop(); db.project.drop(); db.environment.drop(); db.serviceInstance.drop();db.collectionConfig.drop();
```

#### Updating JWT allow/block list

The JWT allow and block lists are stored in the collections jwtAllow and jwtBlock, respectively. The lists allow you to filter on the cliams 'jti', 'sub' and 'client_id'. Allowing or blocking is specified by adding a document to the associated collection with any, all or none of those cliams specified. Keys that are not present are considered to match. This means you can allow (or block) all JWTs by adding an empty object. An allow document of `{"sub":"cool@person.tv"}` means all JWT cliams with a sub matching "cool@person.tv" will be allowed. If you add a JTI key/value as well then both the JTI and sub will need to match. The block list works similarly.

## API demonstrations

There are a handful of demonstration curl commands in the scripts folder.

```bash
$ cd scripts
# ENV setup
$ source ./setenv-curl-local.sh
# Health check
$ ./health.sh
# Get token
$ ./provision-db-demo.sh
# Get secret id for provisioning fluentbit
$ ./provision-fluentbit-demo.sh
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Building image

The dockerfile can be built locally by setting the REPO_LOCATION.

`podman build . -t nr-broker`

## Built with NestJS

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

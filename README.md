# Gluu Admin UI

This project has been built on [Airframe React](https://github.com/0wczar/airframe-react). 

## Installation 

### Prerequisites

Node, NPM (latest, stable version)

### Development

To run the project locally execute followig commands.

```
git clone https://github.com/GluuFederation/gluu-admin-ui
cd gluu-admin-ui
rm -rf jans_config_api
npm install @openapitools/openapi-generator-cli -g
npm run api
npm install
npm run start

```

**Note:** Please check this [link](https://raw.githubusercontent.com/0wczar/airframe-react/master/.npmrc) for NPM access token to be added to `NPM_TOKEN` field in `.env` file.


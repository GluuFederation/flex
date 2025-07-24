# Gluu Admin UI

The Gluu Flex Admin UI is a reactive web interface to simplify the management and configuration of your Auth Server. The Admin UI enables you to easily view and edit configuration properties, interception scripts, clients, and metrics in one place.

## Introduction

This document outlines the steps to setup the project for development, including installation, configuration, and running the application.

### Prerequisites

Before setting up the project, ensure you have the following installed :

- NodeJS : v18.xx.x or above
- NPM : 8.xx or above
- Java : openjdk 17.x.x or above
- Gluu Flex : follow the instruction [here](https://github.com/GluuFederation/flex/tree/main/docker-flex-monolith)

### Installation

Follow these steps to setup the project :

1. Clone the project

```
git clone https://github.com/GluuFederation/flex
cd flex/admin-ui
```

2. Environment configuration

Set the env `NODE_ENV` to `development`.

```
export NODE_ENV=development
```

Create a file name `.env.development` with following contents.

```
BASE_PATH=/admin/
CONFIG_API_BASE_URL=https://[jans-server-host]/jans-config-api
API_BASE_URL=https://[jans-server-host]/jans-config-api/admin-ui
NPM_TOKEN=
```

**Note:**

- replace `[jans-server-host]` with your actual jans server.
- the `NPM_TOKEN` is not being used anymore, we can leave this empty.

3. Install openapi-generator-cli globally in your system.

```
npm install @openapitools/openapi-generator-cli -g
```

4. Install project packages.

```
npm install
```

5. Run api specs generator.

```
npm run api
```

6. Run the project.

```
npm run install
```

Once the project is compiled and started, UI can be accessed at URL: http://localhost:4100

## Code Formatting

This project uses Prettier and ESLint to maintain consistent code formatting. A pre-commit hook automatically checks code formatting before commits.

### Available Commands

Format all files in the project:

```
npm run format
```

Check if files need formatting:

```
npm run format:check
```

### Pre-commit Hook

The project is configured with Husky to run formatting checks before commits. If your staged files are not properly formatted, the commit will fail with an error message. To fix this:

1. Run the format command to fix formatting issues:

```
npm run format
```

2. Add the formatted files and commit again:

```
git add .
git commit -m "your commit message"
```

**Note:** The pre-commit hook only checks staged files, ensuring fast commits while maintaining code quality.

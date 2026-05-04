# Gluu Admin UI

The Gluu Flex Admin UI is a reactive web interface for managing Auth Server configuration, scripts, clients, and metrics.

## Development Setup

### Prerequisites

- Node.js `24.x` LTS
- npm `10+`
- Java `17+`
- Gluu Flex: follow the instructions [here](https://github.com/GluuFederation/flex/tree/main/docker-flex-monolith)

### Installation

1. Clone the project:

```bash
git clone https://github.com/GluuFederation/flex
cd flex/admin-ui
```

2. Create `.env.development`:

```dotenv
BASE_PATH=/admin/
CONFIG_API_BASE_URL=https://[jans-server-host]/jans-config-api
API_BASE_URL=https://[jans-server-host]/jans-config-api/admin-ui
NPM_TOKEN=
```

Notes:

- Replace `[jans-server-host]` with your actual Jans server host.
- `NPM_TOKEN` is no longer required and can stay empty.

3. Install project packages:

```bash
npm install
```

4. Generate the merged OpenAPI client:

```bash
npm run api
```

5. Start the Vite development server:

```bash
npm run start:dev
```

The app is then available at the URL shown by Vite in the terminal.

## Common Commands

```bash
npm run start:dev
npm run build:prod
npm run preview
npm run lint:check
npm run type-check
npm run format
npm run format:check
```

## Pre-commit Hook

Husky runs checks on commit for staged files and the project TypeScript build. If a commit is blocked:

```bash
npm run format
npm run lint
npm run type-check
```

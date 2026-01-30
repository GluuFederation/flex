# Code Splitting Implementation Guide

This document outlines the comprehensive code splitting strategy implemented in the Gluu Admin UI to improve performance, reduce bundle sizes, and enhance user experience.

## Implementation Strategy

### 1. Webpack Configuration

#### Vendor Library Splitting

- **React Ecosystem**: `react`, `react-dom`, `react-router`, `react-router-dom`
- **Material-UI**: `@mui/*`, `@emotion/*`
- **Redux**: `@reduxjs/*`, `redux`, `redux-saga`, `redux-persist`
- **Charts**: `recharts`, `react-ace`, `ace-builds`
- **Utilities**: `lodash`, `dayjs`, `axios`, `formik`, `yup`

#### Plugin-based Splitting

- Each plugin gets its own chunk
- Dynamic loading of plugin components
- Fallback mechanisms for failed loads

#### Common Code Splitting

- Shared application code
- Common vendor libraries
- Reusable components

### 2. Route-based Code Splitting

#### Lazy Route Loading

```typescript
// Pre-defined lazy routes
export const LazyRoutes = {
  DashboardPage: createLazyRoute(() => import('../routes/Dashboards/DashboardPage')),
  ProfilePage: createLazyRoute(() => import('../routes/Apps/Profile/ProfilePage')),
  // ... more routes
}
```

#### Usage in Routes

```typescript
<Route
  path="/adm/dashboard"
  element={
    <ProtectedRoute>
      <LazyRoutes.DashboardPage />
    </ProtectedRoute>
  }
/>
```

### 3. Plugin System Enhancement

#### Dynamic Plugin Loading

```typescript
// Async plugin loading
export async function processRoutes() {
  const pluginPromises = plugins.map(async (item) => {
    try {
      const metadata = await import(`${item.metadataFile}`)
      return metadata.default.routes || []
    } catch (error) {
      console.warn(`Failed to load plugin routes: ${item.metadataFile}`, error)
      return []
    }
  })
  // ... handle results
}
```

#### Plugin Component Loading

```typescript
// Dynamic plugin component loading
export const loadPluginComponent = (pluginName: string, componentName: string) => {
  return createLazyComponent(
    () => import(`../../plugins/${pluginName}/components/${componentName}`),
  )
}
```

### 4. Component-based Code Splitting

#### Large Component Splitting

```typescript
// Lazy loading for heavy components
export const LazyComponents = {
  MaterialTable: createLazyComponent(() => import('@material-table/core')),
  ReactAce: createLazyComponent(() => import('react-ace')),
  Recharts: createLazyComponent(() => import('recharts')),
  // ... more components
}
```

#### Conditional Loading

```typescript
// Load components only when needed
<ConditionalComponent
  condition={showChart}
  component={LazyComponents.Recharts}
  fallback={<div>Loading chart...</div>}
/>
```

## Usage

### Building with Code Splitting

```bash
# Production build with analysis
npm run analyze

# Development build with analysis
npm run analyze:dev

# Regular builds
npm run build:prod
npm run build:dev
```

### Bundle Analysis

```bash
# Generate and analyze bundle
npm run analyze

```

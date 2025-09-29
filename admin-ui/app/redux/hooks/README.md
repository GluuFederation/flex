# Typed Redux Hooks

This directory contains typed Redux hooks that provide improved type safety for the application.

## Usage

Instead of using the standard `useSelector` and `useDispatch` hooks directly, use the typed versions:

### Before (untyped):
```tsx
import { useDispatch, useSelector } from 'react-redux'

const MyComponent = () => {
  const dispatch = useDispatch()
  const data = useSelector((state: SomeRootState) => state.someReducer)
  
  // dispatch is untyped, state requires manual typing
}
```

### After (typed):
```tsx
import { useAppDispatch, useAppSelector } from 'Redux/hooks'

const MyComponent = () => {
  const dispatch = useAppDispatch() // Fully typed dispatch
  const data = useAppSelector((state) => state.someReducer) // Inferred state type
  
  // Both dispatch and state are fully typed automatically
}
```

## Available Exports

- `useAppDispatch()` - Typed dispatch hook
- `useAppSelector` - Typed selector hook  
- `RootState` - Global root state type
- `AppDispatch` - Typed dispatch type
- `AppThunk<ReturnType>` - Type for Redux thunks

## For Thunks

When creating async thunks, you can use the `AppThunk` type:

```tsx
import type { AppThunk } from 'Redux/hooks'

const myThunk = (): AppThunk => (dispatch, getState) => {
  // dispatch and getState are fully typed
  const state = getState()
  dispatch(someAction())
}
```

## Benefits

1. **Type Safety**: Catch type errors at compile time
2. **Better IntelliSense**: Full autocomplete for state and actions
3. **Refactoring Safety**: Changes to state structure are caught immediately
4. **Consistency**: Standardized typing across the application

## Migration

To migrate existing components:

1. Replace `useDispatch` with `useAppDispatch`
2. Replace `useSelector` with `useAppSelector`  
3. Remove manual `RootState` type annotations from selectors
4. Remove manual `dispatch as AppDispatch` type assertions

## Plugin Components

For plugin components that use dynamically registered reducers, you have two options:

### Option 1: Keep local typing (recommended for plugins)
```tsx
// For components that use plugin-specific reducers
import { useDispatch, useSelector } from 'react-redux'
import type { PluginRootState } from './types'

const dispatch = useDispatch()
const data = useSelector((state: PluginRootState) => state.pluginReducer)
```

### Option 2: Use typed hooks with intersection types
```tsx
// If you need both global and plugin state
import { useAppDispatch, useAppSelector } from 'Redux/hooks'
import type { RootState } from 'Redux/hooks'
import type { PluginState } from './types'

type ExtendedRootState = RootState & { pluginReducer: PluginState }

const dispatch = useAppDispatch()
const data = useAppSelector((state: ExtendedRootState) => state.pluginReducer)
```

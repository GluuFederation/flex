import type { FallbackProps } from 'react-error-boundary'

type GluuErrorScreenVariant = 'crash' | 'not-found'

type GluuErrorScreenProps = Partial<FallbackProps> & {
  variant?: GluuErrorScreenVariant
}

export type { GluuErrorScreenProps }

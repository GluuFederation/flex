import { useGetAllWebhooks } from 'JansConfigApi'
import type { WebhookEntry, PagedWebhookResult } from '../types'

export function useGetWebhook(webhookId: string | undefined) {
  const result = useGetAllWebhooks(
    {
      limit: 100,
      startIndex: 0,
      pattern: webhookId ?? '',
    },
    {
      query: {
        enabled: Boolean(webhookId),
        select: (data): WebhookEntry | undefined => {
          const entries = (data as PagedWebhookResult)?.entries ?? []
          return entries.find((e) => e.inum === webhookId)
        },
      },
    },
  )

  return {
    ...result,
    webhook: result.data,
    isPending: result.status === 'pending' || result.isFetching,
  }
}

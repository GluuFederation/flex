export type WebhookSortBy = 'displayName' | 'url' | 'httpMethod' | 'jansEnabled'

export type WebhookSearchProps = {
  pattern: string
  sortBy: WebhookSortBy
  sortOrder: 'ascending' | 'descending'
  limit: number
  onPatternChange: (pattern: string) => void
  onSortByChange: (sortBy: WebhookSortBy) => void
  onSortOrderChange: (sortOrder: 'ascending' | 'descending') => void
  onLimitChange: (limit: number) => void
}

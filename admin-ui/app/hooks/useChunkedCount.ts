import { startTransition, useEffect, useState } from 'react'

type ChunkedCountOptions = {
  enabled?: boolean
  initialCount?: number
}

/**
 * Use this when a component renders a long list: many form fields, rows or nested settings.
 *
 * Mounting hundreds of heavy items in one go freezes the page, and clicks, hover and the
 * sidebar all wait until it is done. This hook returns how many items to render right now.
 * It starts at `initialCount` and adds `chunkSize` after every screen update, as a
 * low-priority render, so the browser can respond between chunks.
 *
 * @example
 * const visibleCount = useChunkedCount(items.length, 20)
 * return items.slice(0, visibleCount).map(renderItem)
 *
 * @param total number of items in the list
 * @param chunkSize items added after each screen update
 * @param options.enabled false holds the count, e.g. until a list above has finished
 * @param options.initialCount items shown on the first render (default 0)
 */
const useChunkedCount = (
  total: number,
  chunkSize: number,
  { enabled = true, initialCount = 0 }: ChunkedCountOptions = {},
): number => {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    if (!enabled || count >= total) return
    startTransition(() => setCount(Math.min(count + chunkSize, total)))
  }, [count, total, chunkSize, enabled])

  return Math.min(count, total)
}

export { useChunkedCount }

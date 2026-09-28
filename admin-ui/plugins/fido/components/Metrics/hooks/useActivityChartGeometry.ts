import { useMemo } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MEDIA_QUERY_OPTIONS, MOBILE_MEDIA_QUERY, TABLET_MAX_MEDIA_QUERY } from '@/constants'
import { DESKTOP_CHART_GEOMETRY, MOBILE_CHART_GEOMETRY } from 'Plugins/fido/shared/charts'
import {
  ACTIVITY_COMPACT_DENSE_BUCKET_COUNT,
  ACTIVITY_DENSE_BUCKET_COUNT,
  ACTIVITY_MIN_BUCKET_WIDTH,
  ACTIVITY_MOBILE_DENSE_BUCKET_COUNT,
} from '../constants'

const COMPACT_MAX_TICKS = 4

const useActivityChartGeometry = (bucketCount: number, axisColor: string) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const isCompact = useMediaQuery(TABLET_MAX_MEDIA_QUERY, MEDIA_QUERY_OPTIONS)
  const chartGeometry = isMobile ? MOBILE_CHART_GEOMETRY : DESKTOP_CHART_GEOMETRY

  const denseBucketCount = isMobile
    ? ACTIVITY_MOBILE_DENSE_BUCKET_COUNT
    : isCompact
      ? ACTIVITY_COMPACT_DENSE_BUCKET_COUNT
      : ACTIVITY_DENSE_BUCKET_COUNT
  const isDense = bucketCount > denseBucketCount

  const cardTickInterval =
    isCompact && !isDense ? Math.max(0, Math.ceil(bucketCount / COMPACT_MAX_TICKS) - 1) : 0

  const tickFontSize = isCompact
    ? MOBILE_CHART_GEOMETRY.TICK_FONT_SIZE
    : chartGeometry.TICK_FONT_SIZE

  const axisTick = useMemo(
    () => ({ fill: axisColor, fontSize: tickFontSize }),
    [axisColor, tickFontSize],
  )

  const minBucketWidth = isMobile
    ? ACTIVITY_MIN_BUCKET_WIDTH.MOBILE
    : isCompact
      ? ACTIVITY_MIN_BUCKET_WIDTH.COMPACT
      : ACTIVITY_MIN_BUCKET_WIDTH.DESKTOP
  const scrollWidth = bucketCount > 0 ? bucketCount * minBucketWidth : undefined

  return {
    isMobile,
    isCompact,
    chartGeometry,
    isDense,
    cardTickInterval,
    tickFontSize,
    axisTick,
    scrollWidth,
  }
}

export default useActivityChartGeometry

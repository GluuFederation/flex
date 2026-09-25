import React, { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Card, CardBody } from 'Components'
import { useTranslation } from 'react-i18next'
import { Close, Fullscreen, ZoomIn, ZoomOut } from '@/components/icons'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useChartShellStyles } from './chartShell.style'
import { CHART_ZOOM } from './constants'
import useChartZoom from './useChartZoom'
import useFullscreenModal from './useFullscreenModal'
import type { ChartCardProps } from './types'

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  caption,
  accentColor,
  headerExtra,
  cardClassName,
  bodyClassName,
  minHeight,
  showExpand = true,
  hideTitle = false,
  zoomable = false,
  isEmpty = false,
  children,
}) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useChartShellStyles({ isDark, themeColors })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [collapsedHeight, setCollapsedHeight] = useState<number>(0)
  const cardContentRef = useRef<HTMLDivElement>(null)
  const { zoom, zoomIn, zoomOut, resetZoom, surfaceRef } = useChartZoom(isFullscreen && zoomable)

  const openFullscreen = useCallback(() => {
    setCollapsedHeight(cardContentRef.current?.offsetHeight ?? 0)
    setIsFullscreen(true)
  }, [])
  const closeFullscreen = useCallback(() => setIsFullscreen(false), [])
  const { containerRef, closeButtonRef } = useFullscreenModal(isFullscreen, closeFullscreen)

  const cardClasses = cardClassName ? `${classes.chartCard} ${cardClassName}` : classes.chartCard

  const cardStyle =
    minHeight || accentColor
      ? {
          ...(minHeight ? { minHeight } : {}),
          ...(accentColor ? { borderColor: accentColor } : {}),
        }
      : undefined

  const heading = (
    <>
      {!hideTitle && (
        <GluuText variant="div" className={classes.chartTitle}>
          {title}
        </GluuText>
      )}
      {caption && (
        <GluuText variant="div" className={classes.chartCaption}>
          {caption}
        </GluuText>
      )}
    </>
  )

  const fullscreenModal =
    isFullscreen &&
    createPortal(
      <>
        <button
          type="button"
          className={classes.chartModalOverlay}
          onClick={closeFullscreen}
          aria-label={t('actions.close')}
        />
        <div
          ref={containerRef}
          className={classes.chartModalContainer}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : undefined}
        >
          <div className={classes.chartModalHeader}>
            <GluuText variant="h2" className={classes.chartModalTitle}>
              {title}
            </GluuText>
            <div className={classes.chartModalActions}>
              {zoomable && !isEmpty && (
                <div className={classes.chartZoomControls}>
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoom <= CHART_ZOOM.MIN}
                    className={classes.chartZoomButton}
                    aria-label={t('messages.zoom_out')}
                    title={t('messages.zoom_out')}
                  >
                    <ZoomOut fontSize="small" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={resetZoom}
                    className={classes.chartZoomLevel}
                    aria-label={t('messages.reset_zoom')}
                    title={t('messages.reset_zoom')}
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={zoomIn}
                    disabled={zoom >= CHART_ZOOM.MAX}
                    className={classes.chartZoomButton}
                    aria-label={t('messages.zoom_in')}
                    title={t('messages.zoom_in')}
                  >
                    <ZoomIn fontSize="small" aria-hidden />
                  </button>
                </div>
              )}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeFullscreen}
                className={classes.chartModalCloseButton}
                aria-label={t('actions.close')}
                title={t('actions.close')}
              >
                <Close fontSize="small" aria-hidden />
              </button>
            </div>
          </div>
          <div className={classes.chartModalBody} ref={surfaceRef}>
            {caption && (
              <GluuText variant="div" className={classes.chartModalCaption}>
                {caption}
              </GluuText>
            )}
            {children(true, zoom)}
          </div>
        </div>
      </>,
      document.body,
    )

  return (
    <>
      <Card className={cardClasses} style={cardStyle}>
        {showExpand && (
          <button
            type="button"
            className={classes.chartExpandButton}
            onClick={openFullscreen}
            aria-label={t('messages.expand')}
            title={t('messages.expand')}
          >
            <Fullscreen fontSize="small" aria-hidden />
          </button>
        )}
        <CardBody className={bodyClassName}>
          {headerExtra ? (
            <div className={classes.chartCardHeader}>
              <div className={classes.chartCardHeaderMain}>{heading}</div>
              <div className={classes.chartCardHeaderExtra}>{headerExtra}</div>
            </div>
          ) : (
            heading
          )}
          <div
            ref={cardContentRef}
            style={isFullscreen ? { minHeight: collapsedHeight } : undefined}
          >
            {!isFullscreen && children(false, CHART_ZOOM.DEFAULT)}
          </div>
        </CardBody>
      </Card>
      {fullscreenModal}
    </>
  )
}

export default ChartCard

import customColors, { hexToRgb } from '@/customColors'

interface CardBorderStyleOptions {
  isDark: boolean
  borderRadius?: number | string
  borderWidth?: string
  gradientPosition?: 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'center'
  ellipseSize?: string
}

export const getCardBorderStyle = (options: CardBorderStyleOptions) => {
  const {
    isDark,

    borderRadius = 16,
    borderWidth = '1px',
    gradientPosition = 'top right',
    ellipseSize = '200% 160%', // Optimized for corner positioning
  } = options

  const gradientPositionMap: Record<string, string> = {
    'top right': '100% 0%',
    'top left': '0% 0%',
    'bottom right': '100% 100%',
    'bottom left': '0% 100%',
    'center': '50% 50%',
  }

  const getGradientPosition = (position: string) => {
    return gradientPositionMap[position] || gradientPositionMap['top right']
  }

  if (isDark) {
    return {
      'border': 'none',
      'boxShadow': 'none',
      'position': 'relative' as const,
      '&::before': {
        content: '""',
        position: 'absolute' as const,
        top: `-${borderWidth}`,
        left: `-${borderWidth}`,
        right: `-${borderWidth}`,
        bottom: `-${borderWidth}`,
        borderRadius: borderRadius,
        padding: borderWidth,
        background: `radial-gradient(ellipse ${ellipseSize} at ${getGradientPosition(gradientPosition)}, 
          rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.4) 0%, 
          rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.45) 12%, 
          rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.75) 25%, 
          rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.8) 45%, 
          rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.8) 65%, 
          rgba(${hexToRgb(customColors.darkBorderGradientBase)}, 0.8) 100%)`,
        WebkitMask: `linear-gradient(${customColors.white} 0 0) content-box, linear-gradient(${customColors.white} 0 0)`,
        WebkitMaskComposite: 'xor' as const,
        mask: `linear-gradient(${customColors.white} 0 0) content-box, linear-gradient(${customColors.white} 0 0)`,
        maskComposite: 'exclude' as const,
        pointerEvents: 'none' as const,
        zIndex: 0,
      },
    }
  }

  return {
    border: 'none',
    boxShadow: `0px 4px 11px 0px rgba(${hexToRgb(customColors.black)}, 0.05)`,
    borderImage: 'none',
  }
}

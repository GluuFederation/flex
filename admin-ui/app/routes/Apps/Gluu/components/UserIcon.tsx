import { memo, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import DEFAULT_AVATAR_URL from '../../../../images/avatars/ava1.png'
import { useStyles } from '../styles/UserIcon.style'

interface UserIconProps {
  size?: number
  className?: string
  avatarUrl?: string | null
}

const UserIcon = memo<UserIconProps>(({ size = 40, className, avatarUrl }) => {
  const { classes } = useStyles({ iconSize: size })
  const failedUrlRef = useRef<string | null>(null)

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    const currentSrc = target.src

    if (failedUrlRef.current !== currentSrc) {
      failedUrlRef.current = currentSrc
      target.src = DEFAULT_AVATAR_URL
    }
  }, [])

  const handleImageLoad = useCallback(() => {
    failedUrlRef.current = null
  }, [])

  const containerClassName = [className, classes.container].filter(Boolean).join(' ')

  return (
    <Box className={containerClassName}>
      <Box className={classes.innerBox}>
        <img
          src={avatarUrl || DEFAULT_AVATAR_URL}
          alt="User avatar"
          className={classes.image}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </Box>
    </Box>
  )
})

UserIcon.displayName = 'UserIcon'

export { UserIcon }

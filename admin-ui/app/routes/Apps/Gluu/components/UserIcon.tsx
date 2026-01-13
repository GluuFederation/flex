import { memo } from 'react'
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    if (target.src !== DEFAULT_AVATAR_URL) {
      target.src = DEFAULT_AVATAR_URL
    }
  }

  return (
    <Box className={`${className || ''} ${classes.container}`}>
      <Box className={classes.innerBox}>
        <img
          src={avatarUrl || DEFAULT_AVATAR_URL}
          alt="User avatar"
          className={classes.image}
          onError={handleImageError}
        />
      </Box>
    </Box>
  )
})

UserIcon.displayName = 'UserIcon'

export { UserIcon }

const avatarModules = import.meta.glob('./images/avatars/*', {
  eager: true,
  import: 'default',
})
const allAvatars = Object.values(avatarModules) as string[]

export const randomArray = <T,>(arr: T[]): T => arr[0]

export const randomAvatar = (): string => randomArray(allAvatars)

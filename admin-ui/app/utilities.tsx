import defaultAvatarUrl from './images/avatars/1.jpeg'

// This was a glob over the whole avatars folder, but the picker always returned the first entry,
// so the other avatars were bundled and never shown. Importing the one that was actually used
// keeps the same image and drops the rest from the build.
export const defaultAvatar = (): string => defaultAvatarUrl

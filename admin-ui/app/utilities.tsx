// Define the type for webpack's require.context
declare const require: {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
  ) => {
    keys: () => string[]
    (id: string): string
  }
}

const allAvatars = ((ctx) => {
  const keys = ctx.keys()
  return keys.map(ctx)
})(require.context('./images/avatars', true, /.*/))

export const randomArray = <T,>(arr: T[]): T => arr[0]

export const randomAvatar = (): string => randomArray(allAvatars)

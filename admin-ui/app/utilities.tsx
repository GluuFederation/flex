// Define the type for webpack's require.context
declare const require: {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
  ) => {
    keys: () => string[];
    (id: string): any
  }
}

const allAvatars = ((ctx) => {
  const keys = ctx.keys()
  return keys.map(ctx)
})(require.context('./images/avatars', true, /.*/))

export function randomArray<T>(arr: T[]): T {
  return arr[0]
}

export function randomAvatar(): string {
  return randomArray(allAvatars)
}

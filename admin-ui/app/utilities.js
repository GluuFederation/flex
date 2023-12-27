const allAvatars = (ctx => {
  const keys = ctx.keys()
  return keys.map(ctx)
})(require.context('./images/avatars', true, /.*/))

export function randomArray(arr) {
  return arr[0]
}

export function randomAvatar() {
  return randomArray(allAvatars)
}
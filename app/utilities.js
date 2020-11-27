const allAvatars = (ctx => {
  const keys = ctx.keys();
  return keys.map(ctx);
})(require.context('./images/avatars', true, /.*/));

export function randomArray(arr) {
  const index = Math.round(Math.random() * (arr.length - 1));

  return arr[index];
}

export function randomAvatar() {
  return randomArray(allAvatars);
}
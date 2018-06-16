export const specDone = (food) => {
  let flag = true
  if (food && food.GoodsDetails) {
    food.GoodsDetails.forEach(gd => {
      if (!gd.IsFixed && gd.GroupLimit > 0) {
        flag = false
      }
    })
  }
  return flag
}

export const uid = () => {
  return Math.random().toString(32).substring(2) + (new Date()).getTime().toString(32)
}

export const numberSequence = (max) => {
  let arr = []
  for (let i = 0; i < max; i = i + 1) {
    arr.push(i)
  }
  return arr
}

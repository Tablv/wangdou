// 数组排序

export function sortArr (arr1, arr2) {
  let startArr = arr1
  let endArr = arr2
  let newArr = []
  endArr.map((item, index) => {
    startArr.map((start, number) => {
      if (endArr[index].key === startArr[number].key) {
        newArr.push(startArr[number])
      }
    })
  })
  return newArr
}

export function getHeight (height) {
  let windowHeight = parseInt(window.innerHeight)
  let number = windowHeight - height - 56 - 120
  return  number
}

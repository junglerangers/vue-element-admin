
function getColorByCode(code) {
  if (/^[0-9]/.test(code)) {
    return 'success'
  } else {
    return 'primary'
  }
}

/**
 * @param {String} rawString
 * @description 将一个字符串根据运算符号拆分成一个数组,并且保留运算符号,同时根据其代码生成相应的颜色
 * @returns Array
 */
export function splictStringByOperation(rawString) {
  const strArray = rawString.split('')
  const strTemp = []; const strResult = []
  let temp = ''
  for (let i = 0; i < strArray.length; i++) {
    if (/[\+\-\*%()\\=]/.test(strArray[i])) {
      if (strTemp.length > 0) {
        temp = strTemp.join('')
        strResult.push({
          element: temp,
          type: getColorByCode(temp)
        })
        strTemp.length = 0 // 清空temp数组
      }
      strResult.push({ element: strArray[i], type: 'op' })
    } else {
      strTemp.push(strArray[i])
    }
  }
  if (strTemp.length > 0) {
    temp = strTemp.join('')
    strResult.push({ element: temp, type: getColorByCode(temp) })
  }
  return strResult
}

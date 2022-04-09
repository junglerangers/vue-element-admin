
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
export function splictStringByOperator(rawString) {
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

/**
 * 检索字符串,找到最后位于运算符号后面的字符串
 * @param {String} str
 * @returns String
 */
export function getLastStrByOperator(str) {
  if (str) {
    let index = str.length - 1
    let result = ''
    let temp
    while (index >= 0) {
      temp = str.charAt(index)
      if (/[\+\-\*%()\\=]/.test(temp)) {
        break
      }
      result += temp
      index--
    }
    return result.split('').reverse().join('')
  }
}

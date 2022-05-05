
function getColorByCode(code, index) {
  if (/^[0-9]/.test(code)) {
    return 'success'
  } else {
    if (index < 0) {
      return 'danger'
    } else {
      return 'primary'
    }
  }
}

/**
 * @param {String} rawString
 * @description 将一个字符串根据运算符号拆分成一个数组,并且保留运算符号,同时根据其代码生成相应的颜色
 * @returns Array
 */
export function splictStringByOperator(rawString, dict) {
  const strArray = rawString.split('')
  const strTemp = []; const strResult = []
  let temp = ''
  let type = ''
  for (let i = 0; i < strArray.length; i++) {
    if (/[\/\+\-\*%()\\=]/.test(strArray[i])) {
      if (strTemp.length > 0) {
        temp = strTemp.join('')
        const index = dict.findIndex(element => element.TNAME === temp)
        type = getColorByCode(temp, index)
        strResult.push({
          element: temp,
          type: type,
          index: index,
          code: type === 'success' ? temp : (index < 0 ? 0 : dict[index].TCODE)
        })
        strTemp.length = 0 // 清空temp数组
      }
      strResult.push({ element: strArray[i], type: 'op', code: strArray[i] })
    } else {
      strTemp.push(strArray[i])
    }
  }
  if (strTemp.length > 0) {
    temp = strTemp.join('')
    const index = dict.findIndex((element) => element.TNAME === temp)
    type = getColorByCode(temp, index)
    strResult.push({
      element: temp,
      type: type,
      index: index,
      code: type === 'success' ? temp : index < 0 ? 0 : dict[index].TCODE
    })
  }
  return strResult
}

export function splictStringByOperatorSign(rawString, dict) {
  const strArray = rawString.split('')
  const strTemp = []
  const strResult = []
  let temp = ''
  let type = ''
  for (let i = 0; i < strArray.length; i++) {
    if (/[\/\+\-\*%()\\=]/.test(strArray[i])) {
      if (strTemp.length > 0) {
        temp = strTemp.join('')
        if (temp[0] === '[' && temp[temp.length - 1] === ']') {
          temp = 'T' + temp.substring(1, temp.length - 1)
        }
        const index = dict.findIndex(element => (element.TCODE === (temp)))
        type = getColorByCode(temp, index)
        strResult.push({
          element: type === 'success' ? temp : index < 0 ? 'undefined' : dict[index].TNAME,
          type: type,
          index: index,
          code: temp
        })
        strTemp.length = 0 // 清空temp数组
      }
      strResult.push({ element: strArray[i], type: 'op', code: strArray[i] })
    } else {
      strTemp.push(strArray[i])
    }
  }
  if (strTemp.length > 0) {
    temp = strTemp.join('')
    if (temp[0] === '[' && temp[temp.length - 1] === ']') {
      temp = 'T' + temp.substring(1, temp.length - 1)
    }
    const index = dict.findIndex(element => (element.TCODE === (temp)))
    type = getColorByCode(temp, index)
    strResult.push({
      element: type === 'success' ? temp : index < 0 ? 'undefined' : dict[index].TNAME,
      type: type,
      index: index,
      code: temp
    })
  }
  return strResult
}

/**
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
      if (/[\/\+\-\*%()\\=]/.test(temp)) {
        break
      }
      result += temp
      index--
    }
    return result.split('').reverse().join('')
  }
}

import Decimal from 'decimal.js'

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

export function validateArithmeti(str, objList) {
  console.log(str)
  console.log(objList)
  // 存在不合理的变量
  if (objList.some(element => element.index === -1)) {
    return false
  }
  // 剔除空白符
  str = str.replace(/\s/g, '')

  // 错误情况，空字符串
  if (str === '') {
    return true
  }

  // 运算符开头
  if (/^[\x\÷\+\-\*\/]/.test(str)) {
    return false
  }

  // 错误情况，运算符结尾
  if (/[\x\÷\+\-\*\/]$/.test(str)) {
    return false
  }

  // 错误情况，(后面是运算符或者)
  if (/\([\x\÷\+\-\*\/]/.test(str)) {
    return false
  }
  // 错误情况，运算符连续
  if (/[\x\÷\+\-\*\/\(\)]{2,}/.test(str)) {
    return false
  }

  // 空括号
  if (/\(\)/.test(str)) {
    return false
  }

  // 错误情况，括号不配对
  var stack = []
  for (var i = 0, item; i < str.length; i++) {
    item = str.charAt(i)
    if (item === '(') {
      stack.push('(')
    } else if (item === ')') {
      if (stack.length > 0) {
        stack.pop()
      } else {
        return false
      }
    }
  }

  if (stack.length !== 0) {
    return false
  }

  // 错误情况，(后面是运算符
  if (/\([\x\÷\+\-\*\/]/.test(str)) {
    return false
  }

  // 错误情况，)前面是运算符
  if (/[\x\÷\+\-\*\/]\)/.test(str)) {
    return false
  }

  // 错误情况，(前面不是运算符
  if (/[\x\÷\+\-\*\/]\(/.test(str)) {
    return false
  }

  // 错误情况，)后面不是运算符
  if (/\)[\x\÷\+\-\*\/]/.test(str)) {
    return false
  }
}

export function formularToAlgorithm(str, dict) {
  while (str.indexOf('[') >= 0) {
    var start = str.indexOf('[')
    var end = str.indexOf(']')
    var code = 'T' + str.slice(start + 1, end)
    var index = dict.findIndex(element => element.code === code)
    if (dict[index].sign === true) {
      str =
        str.substring(0, start) + dict[index].value + str.substring(end + 1)
    } else {
      dict[index].value = formularToAlgorithm(dict[index].value, dict)
      dict[index].sign = true
    }
  }
  // eslint-disable-next-line no-eval
  return new Decimal(eval(str))
}

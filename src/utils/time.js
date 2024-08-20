/**
 * 返回当前的时间,格式为yyyy/mm/dd hh:mm:ss
 * @returns String
 */
export function getCurrentTime(currentDate) {
  var datetime
  if (currentDate != null) {
    datetime = currentDate
  } else {
    datetime = new Date()
  }
  // console.log(datetime)
  const date = datetime.toISOString().split('T')[0]
  const time = datetime.getHours().toString().padStart(2, '0') + ':' + datetime.getMinutes().toString().padStart(2, '0') + ':' + datetime.getSeconds().toString().padStart(2, 0)
  return date + ' ' + time
}

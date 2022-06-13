/**
 * 返回当前的时间,格式为yyyy/mm/dd hh:mm:ss
 * @returns String
 */
export function getCurrentTime() {
  var datetime = new Date()
  const date = datetime.toISOString().split('T')[0]
  const time = datetime.getHours() + ':' + datetime.getMinutes() + ':' + datetime.getSeconds()
  return date + ' ' + time
}

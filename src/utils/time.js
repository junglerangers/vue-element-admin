export function getCurrentTime() {
  var datetime = new Date()
  const date = datetime.toISOString().split('T')[0]
  const time = datetime.getHours() + ':' + datetime.getMinutes() + ':' + datetime.getSeconds()
  return date + ' ' + time
}

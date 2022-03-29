export default function stringHash(content) {
  var hash = 0
  if (content.length === 0) {
    return hash
  }
  for (var i = 0; i < content.length; i++) {
    var char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash
}

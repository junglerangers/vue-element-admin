export async function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.replace('data:', '').replace(/^.+,/, ''))
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

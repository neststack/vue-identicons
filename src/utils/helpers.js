function binaryStringTo3x5Array(binaryString) {
  if (binaryString?.length !== 15) {
    binaryString = binaryString.slice(0, 15)
  }

  // Initialize a 3x5 array
  const array3x5 = []

  // Loop through the binary string and split it into rows
  for (let i = 0; i < 3; i++) {
    // Extract a substring for each row (5 characters)
    const rowString = binaryString.substring(i * 5, (i + 1) * 5)

    // Convert the row string to an array of integers
    const rowArray = rowString.split('').map(Number)

    // Push the row array to the 3x5 array
    array3x5.push(rowArray)
  }

  return array3x5
}

function downloadCanvasAsImage({ imageFormat, fileName, canvasId: canvasId = 'identiconCanvas' }) {
  // Get the canvas element
  const canvas = document.getElementById(canvasId)

  // Get the data URL of the canvas content
  const dataURL = canvas.toDataURL(`image/${imageFormat}`)

  // Convert the data URL to a Blob
  const blob = dataURLtoBlob(dataURL)

  // Create a download link
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${fileName}.${imageFormat}`

  // Trigger a click event on the link to initiate the download
  a.click()
}

function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(';base64,')
  const contentType = parts[0].split(':')[1]

  // For JPEG images, set the content type explicitly
  const fixedContentType = contentType === 'image/jpg' ? 'image/jpeg' : contentType

  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  return new Blob([uInt8Array], { type: fixedContentType })
}

async function generateHash(inputString) {
  try {
    const hash = await sha256(inputString)
    return hash
  } catch (error) {
    console.error(error)
  }
}

function getNumberInputElementDetails(elementId) {
  const inputElement = document.getElementById(elementId)
  const currentValue = parseInt(inputElement.value, 10)
  const min = parseInt(inputElement.min, 10)
  const max = parseInt(inputElement.max, 10)
  const step = parseInt(inputElement.step, 10)

  return {
    currentValue,
    min,
    max,
    step
  }
}

function rotateString(inputString, positions) {
  // Ensure positions is a positive integer
  positions = positions % inputString?.length
  if (positions < 0) {
    positions += inputString.length
  }

  // Rotate the string using substring concatenation
  const rotatedString = inputString.substring(positions) + inputString.substring(0, positions)

  return rotatedString
}

async function sha256(message) {
  // Convert the string to Uint8Array
  const encoder = new TextEncoder()
  const data = encoder.encode(message)

  // Hash the data using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((byte) => byte.toString(2).padStart(2, '0')).join('')

  return hashHex
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function transpose2DArray(array2D) {
  return array2D[0].map((_, colIndex) => array2D.map((row) => row[colIndex]))
}

export {
  binaryStringTo3x5Array,
  generateHash,
  getNumberInputElementDetails,
  downloadCanvasAsImage,
  rotateString,
  sleep,
  transpose2DArray
}

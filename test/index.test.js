import { decode } from '../src'

const hexToBuffer = (str) => {
  const hex = str.split(' ')
  const buf = Buffer.alloc(hex.length)
  hex.forEach((hex, i) => {
    buf.writeUInt8(parseInt(hex, 16), i)
  })
  return buf
}

const bufferToHex = (buf) => {
  const str = []
  let pos = 0
  while (pos < buf.length) {
    const hex = ('00' + buf.readUInt8(pos).toString(16)).slice(-2).toUpperCase()
    str.push(hex)
    pos++
  }
  return str.join(' ')
}

describe('rle', () => {
  test('should work', () => {
    const buf = hexToBuffer('02 01 02 02 80 03 81 04 82 05')
    const decoded = decode(buf)
    const hex = bufferToHex(decoded)
    expect(hex).toBe('01 02 02 03 03 03 04 04 04 04 05 05 05 05 05')
  })
})

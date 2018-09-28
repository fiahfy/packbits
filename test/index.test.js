import { encode, decode } from '../src'

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

describe('encode', () => {
  test('should work', () => {
    let buf = hexToBuffer('AA AA AA 80 00 2A AA AA AA AA 80 00 2A 22 AA AA AA AA AA AA AA AA AA AA')
    let encoded = encode(buf)
    let hex = bufferToHex(encoded)
    expect(hex).toBe('FE AA 02 80 00 2A FD AA 03 80 00 2A 22 F7 AA')
  })

  test('should work for ICNS', () => {
    let buf = hexToBuffer('01 02 02 03 03 03 04 04 04 04 05 05 05 05 05')
    let encoded = encode(buf, { icns: true })
    let hex = bufferToHex(encoded)
    expect(hex).toBe('02 01 02 02 80 03 81 04 82 05')
  })
})

describe('decode', () => {
  test('should work', () => {
    let buf = hexToBuffer('FE AA 02 80 00 2A FD AA 03 80 00 2A 22 F7 AA')
    let decoded = decode(buf)
    let hex = bufferToHex(decoded)
    expect(hex).toBe('AA AA AA 80 00 2A AA AA AA AA 80 00 2A 22 AA AA AA AA AA AA AA AA AA AA')
  })

  test('should work for ICNS', () => {
    let buf = hexToBuffer('02 01 02 02 80 03 81 04 82 05')
    let decoded = decode(buf, { icns: true })
    let hex = bufferToHex(decoded)
    expect(hex).toBe('01 02 02 03 03 03 04 04 04 04 05 05 05 05 05')
  })
})

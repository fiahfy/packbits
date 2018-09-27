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
    let buf, encoded, hex

    buf = hexToBuffer('12 12 12 12 12 13 13 13 13 13 13 13 13 13 12 12 12')
    encoded = encode(buf)
    hex = bufferToHex(encoded)
    expect(hex).toBe('05 12 09 13 03 12')

    buf = hexToBuffer('12 13 14 15 15 15 15')
    encoded = encode(buf)
    hex = bufferToHex(encoded)
    expect(hex).toBe('01 12 01 13 01 14 04 15')
  })

  test('should work with PackBits', () => {
    let buf, encoded, hex

    buf = hexToBuffer('AA AA AA 80 00 2A AA AA AA AA 80 00 2A 22 AA AA AA AA AA AA AA AA AA AA')
    encoded = encode(buf, { algorithm: 'pack-bits' })
    hex = bufferToHex(encoded)
    expect(hex).toBe('FE AA 02 80 00 2A FD AA 03 80 00 2A 22 F7 AA')
  })

  // test('should work with icns PackBits', () => {
  //   let buf, encoded, hex

  //   buf = hexToBuffer('01 02 02 03 03 03 04 04 04 04 05 05 05 05 05')
  //   encoded = encode(buf, { algorithm: 'icns-pack-bits' })
  //   hex = bufferToHex(encoded)
  //   expect(hex).toBe('02 01 02 02 80 03 81 04 82 05')
  // })
})

describe('decode', () => {
  test('should work', () => {
    let buf, decoded, hex

    buf = hexToBuffer('05 12 09 13 03 12')
    decoded = decode(buf)
    hex = bufferToHex(decoded)
    expect(hex).toBe('12 12 12 12 12 13 13 13 13 13 13 13 13 13 12 12 12')

    buf = hexToBuffer('01 12 01 13 01 14 04 15')
    decoded = decode(buf)
    hex = bufferToHex(decoded)
    expect(hex).toBe('12 13 14 15 15 15 15')
  })

  test('should work with PackBits', () => {
    let buf, decoded, hex

    buf = hexToBuffer('FE AA 02 80 00 2A FD AA 03 80 00 2A 22 F7 AA')
    decoded = decode(buf, { algorithm: 'pack-bits' })
    hex = bufferToHex(decoded)
    expect(hex).toBe('AA AA AA 80 00 2A AA AA AA AA 80 00 2A 22 AA AA AA AA AA AA AA AA AA AA')
  })

  test('should work with icns PackBits', () => {
    let buf, decoded, hex

    buf = hexToBuffer('02 01 02 02 80 03 81 04 82 05')
    decoded = decode(buf, { algorithm: 'icns-pack-bits' })
    hex = bufferToHex(decoded)
    expect(hex).toBe('01 02 02 03 03 03 04 04 04 04 05 05 05 05 05')
  })
})

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

const encodeMaps = [
  [
    'AA AA AA BB CC DD AA AA AA AA BB CC DD EE AA AA AA AA AA AA AA AA AA AA',
    'FE AA 02 BB CC DD FD AA 03 BB CC DD EE F7 AA'
  ],
  ['AA', '00 AA'],
  ['AA AA AA AA AA AA AA AA', 'F9 AA'],
  ['AA AA AA AA AA AA AA AA BB', 'F9 AA 00 BB'],
  ['A0 A2 A3 A4 A5 A6 A7 A8', '07 A0 A2 A3 A4 A5 A6 A7 A8'],
  ['A0 A2 A3 A4 A5 A6 A7 A8 A8', '06 A0 A2 A3 A4 A5 A6 A7 FF A8']
]

const icnsEncodeMaps = [
  [
    'AA BB BB CC CC CC DD DD DD DD FF FF FF FF FF',
    '02 AA BB BB 80 CC 81 DD 82 FF'
  ]
]

describe('encode', () => {
  test('should work', () => {
    for (let [src, enc] of encodeMaps) {
      const buf = hexToBuffer(src)
      const encoded = encode(buf)
      const hex = bufferToHex(encoded)
      expect(hex).toBe(enc)
    }
  })

  test('should work for ICNS', () => {
    for (let [src, enc] of icnsEncodeMaps) {
      const buf = hexToBuffer(src)
      const encoded = encode(buf, { icns: true })
      const hex = bufferToHex(encoded)
      expect(hex).toBe(enc)
    }
  })
})

describe('decode', () => {
  test('should work', () => {
    for (let [src, enc] of encodeMaps) {
      const buf = hexToBuffer(enc)
      const decoded = decode(buf)
      const hex = bufferToHex(decoded)
      expect(hex).toBe(src)
    }
  })

  test('should work for ICNS', () => {
    for (let [src, enc] of icnsEncodeMaps) {
      const buf = hexToBuffer(enc)
      const decoded = decode(buf, { icns: true })
      const hex = bufferToHex(decoded)
      expect(hex).toBe(src)
    }
  })
})

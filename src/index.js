const encodeWithRLE = (buffer) => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    const byte = buffer[i]
    let count = 1
    while (++i < buffer.length && byte === buffer[i] && count < 255) {
      count++
    }
    const buf = Buffer.alloc(2)
    buf[0] = count
    buf[1] = byte
    bufs.push(buf)
  }

  const list = bufs
  const totalLength = bufs.reduce((carry, buf) => carry + buf.length, 0)

  return Buffer.concat(list, totalLength)
}

const decodeWithRLE = (buffer) => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    const count = buffer[i]
    const buf = Buffer.alloc(count, buffer.slice(i + 1, i + 2))
    bufs.push(buf)
    i += 2
  }

  const list = bufs
  const totalLength = bufs.reduce((carry, buf) => carry + buf.length, 0)

  return Buffer.concat(list, totalLength)
}

const encodeWithPackBits = (buffer) => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    const byte = buffer[i]
    if (i + 1 >= buffer.length) {
      const buf = Buffer.alloc(2)
      buf[0] = 0
      buf[1] = byte
      bufs.push(buf)
      break
    }

    const next = buffer[i + 1]
    if (byte === next) {
      let j = i + 1
      let count = 2
      while (++j < buffer.length && byte === buffer[j] && count < 128) {
        count++
      }
      const buf = Buffer.alloc(2)
      buf[0] = 1 - count
      buf[1] = byte
      bufs.push(buf)
      i = j
    } else {
      let j = i + 1
      let count = 2
      let prev = next
      while (++j < buffer.length && prev !== buffer[j] && count < 128) {
        prev = buffer[j]
        count++
      }
      if (prev === buffer[j]) {
        j--
        count--
      }
      const buf = Buffer.alloc(1)
      buf[0] = count - 1
      bufs.push(buf)
      bufs.push(buffer.slice(i, j))
      i = j
    }
  }

  const list = bufs
  const totalLength = bufs.reduce((carry, buf) => carry + buf.length, 0)

  return Buffer.concat(list, totalLength)
}

const decodeWithPackBits = (buffer) => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    let count = buffer.readInt8(i)

    let buf
    if (count === -128) {
      i++
      continue
    } else if (count < 0) {
      count = 1 - count
      buf = Buffer.alloc(count, buffer.slice(i + 1, i + 2))
      i += 2
    } else {
      buf = buffer.slice(i + 1, i + count + 2)
      i += count + 2
    }

    bufs.push(buf)
  }

  const list = bufs
  const totalLength = bufs.reduce((carry, buf) => carry + buf.length, 0)

  return Buffer.concat(list, totalLength)
}

const encodeWithICNSPackBits = (buf) => {
  const bufs = []

  let i = 0
  while (i < buf.length) {
    const byte = buf[i]
    let count = 1
    let j = 0
    let run = byte
    // let runStart = i
    let runCount = 1
    while (++j < buf.length && count < 255) {
      if (run === buf[j]) {
        runCount++
      } else {
        runCount++
      }
      if (runCount === 3) {

      }
      count++
    }
    const b = Buffer.alloc(2)
    b.writeUInt8(count, 0)
    b.writeUInt8(byte, 1)
    bufs.push(b)
  }

  const list = bufs
  const totalLength = bufs.reduce((carry, buf) => carry + buf.length, 0)

  return Buffer.concat(list, totalLength)
}

const decodeWithICNSPackBits = (buffer) => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    let count = buffer[i]

    let buf
    if (count >= 128) {
      // count = 256 - count
      // o = Buffer.alloc(count + 1, buffer.slice(i + 1, i + 2))
      count = count - 128 + 3
      buf = Buffer.alloc(count, buffer.slice(i + 1, i + 2))
      i += 2
    } else {
      buf = buffer.slice(i + 1, i + count + 2)
      i += count + 2
    }

    bufs.push(buf)
  }

  const list = bufs
  const totalLength = bufs.reduce((carry, buf) => carry + buf.length, 0)

  return Buffer.concat(list, totalLength)
}

export const encode = (buf, { algorithm } = { algorithm: 'traditional' }) => {
  switch (algorithm) {
    case 'traditional':
      return encodeWithRLE(buf)
    case 'pack-bits':
      return encodeWithPackBits(buf)
    case 'icns-pack-bits':
      return encodeWithICNSPackBits(buf)
    // case 'SRLE':
    //   // return decodeWithSRLE(buf)
  }
}

export const decode = (buf, { algorithm } = { algorithm: 'traditional' }) => {
  switch (algorithm) {
    case 'traditional':
      return decodeWithRLE(buf)
    case 'pack-bits':
      return decodeWithPackBits(buf)
    case 'icns-pack-bits':
      return decodeWithICNSPackBits(buf)
    case 'SRLE':
      // return decodeWithSRLE(buf)
  }
}

const b = Buffer.alloc(7)
b.writeInt8(-128, 0)
b.writeInt8(-127, 1)
b.writeInt8(-1, 2)
b.writeInt8(0, 3)
b.writeInt8(1, 4)
b.writeInt8(127, 5)
// b.writeInt8(128, 6)
console.log(b)

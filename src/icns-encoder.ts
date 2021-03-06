export const encode = (buffer: Buffer): Buffer => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    const byte = buffer[i]
    // if last 1 or 2 bytes remaining
    if (i + 2 >= buffer.length) {
      const length = buffer.length - i
      const buf = Buffer.from([length - 1])
      bufs.push(buf)
      bufs.push(buffer.slice(i, buffer.length))
      break
    }

    const repeat = byte === buffer[i + 1] && byte === buffer[i + 2]
    if (repeat) {
      // literal repeated
      let j = i + 2
      let length = 3
      while (++j < buffer.length && byte === buffer[j] && length < 130) {
        length++
      }
      const buf = Buffer.from([length + 125, byte])
      bufs.push(buf)
      i = j
    } else {
      // no literal repeated
      let j = i + 2
      let length = 3
      let prev = buffer[j]
      let repeatLength = 1
      while (++j < buffer.length && length < 128) {
        if (prev === buffer[j]) {
          if (++repeatLength > 2) {
            break
          }
        } else {
          prev = buffer[j]
          repeatLength = 1
        }
        length++
      }
      if (repeatLength > 2) {
        j -= 2
        length -= 2
      }
      const buf = Buffer.from([length - 1])
      bufs.push(buf)
      bufs.push(buffer.slice(i, j))
      i = j
    }
  }

  return Buffer.concat(bufs)
}

export const decode = (buffer: Buffer): Buffer => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    const byte = buffer[i]

    // 256 -> skip
    if (byte === 256) {
      i++
      continue
    }

    let buf
    if (byte >= 128) {
      // 128 to 255 -> one byte of data repeated (byte - 125) times
      const length = byte - 125
      buf = Buffer.alloc(length, buffer.slice(i + 1, i + 2))
      i += 2
    } else {
      // 0 to 127 -> (byte + 1) literal bytes
      const length = byte + 1
      buf = buffer.slice(i + 1, i + 1 + length)
      i += 1 + length
    }
    bufs.push(buf)
  }

  return Buffer.concat(bufs)
}

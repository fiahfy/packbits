export const encode = (buffer) => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    const byte = buffer[i]
    // if last 1 or 2 bytes remaining
    if (i + 2 >= buffer.length) {
      const buf = Buffer.from([buffer.length - i])
      bufs.push(buf)
      bufs.push(buffer.slice(i, buffer.length))
      break
    }

    const repeat = byte === buffer[i + 1] && byte === buffer[i + 2]
    if (repeat) {
      let j = i + 2
      let length = 3
      while (++j < buffer.length && byte === buffer[j] && length < 130) {
        length++
      }
      const buf = Buffer.from([length + 128 - 3, byte])
      bufs.push(buf)
      i = j
    } else {
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

export const decode = (buffer) => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    let length = buffer[i]

    let buf
    if (length >= 128) {
      length = length - 128 + 3
      buf = Buffer.alloc(length, buffer.slice(i + 1, i + 2))
      i += 2
    } else {
      buf = buffer.slice(i + 1, i + length + 2)
      i += length + 2
    }

    bufs.push(buf)
  }

  return Buffer.concat(bufs)
}

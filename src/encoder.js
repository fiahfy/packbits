export const encode = (buffer) => {
  const bufs = []

  let i = 0
  while (i < buffer.length) {
    const byte = buffer[i]
    // if last 1 byte remaining
    if (i + 1 >= buffer.length) {
      const buf = Buffer.from([0, byte])
      bufs.push(buf)
      break
    }

    const repeat = byte === buffer[i + 1]
    if (repeat) {
      let j = i + 1
      let length = 2
      while (++j < buffer.length && byte === buffer[j] && length < 128) {
        length++
      }
      const buf = Buffer.from([1 - length, byte])
      bufs.push(buf)
      i = j
    } else {
      let j = i + 1
      let length = 2
      let prev = buffer[j]
      while (++j < buffer.length && prev !== buffer[j] && length < 128) {
        length++
        prev = buffer[j]
      }
      if (prev === buffer[j]) {
        j--
        length--
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
    let length = buffer.readInt8(i)

    let buf
    if (length === -128) {
      i++
      continue
    } else if (length < 0) {
      length = 1 - length
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

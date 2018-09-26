export const encode = (buf) => {
  return buf
}

export const decode = (buf) => {
  const bufs = []

  let i = 0
  while (i < buf.length) {
    let num = buf.readUInt8(i)

    let o
    if (num >= 128) {
      // num = 256 - num
      // o = Buffer.alloc(num + 1, buf.slice(i + 1, i + 2))
      num = num - 128
      o = Buffer.alloc(num + 3, buf.slice(i + 1, i + 2))
      i += 2
    } else {
      o = buf.slice(i + 1, i + num + 2)
      i += num + 2
    }

    bufs.push(o)
  }

  const list = bufs
  const totalLength = bufs.reduce((carry, buf) => carry + buf.length, 0)

  return Buffer.concat(list, totalLength)
}

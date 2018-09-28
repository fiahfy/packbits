import * as Encoder from './encoder'
import * as ICNSEncoder from './icns-encoder'

export const encode = (buf, { icns } = { icns: false }) => {
  return icns ? ICNSEncoder.encode(buf) : Encoder.encode(buf)
}

export const decode = (buf, { icns } = { icns: false }) => {
  return icns ? ICNSEncoder.decode(buf) : Encoder.decode(buf)
}

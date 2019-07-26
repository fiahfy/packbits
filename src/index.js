import * as Encoder from './encoder'
import * as ICNSEncoder from './icns-encoder'

export const encode = (buf, { format } = { format: 'default' }) => {
  return format === 'icns' ? ICNSEncoder.encode(buf) : Encoder.encode(buf)
}

export const decode = (buf, { format } = { format: 'default' }) => {
  return format === 'icns' ? ICNSEncoder.decode(buf) : Encoder.decode(buf)
}

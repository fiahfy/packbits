import * as Encoder from './encoder'
import * as ICNSEncoder from './icns-encoder'

export const encode = (
  buf: Buffer,
  options: { format?: string } = { format: 'default' }
): Buffer => {
  return options.format === 'icns'
    ? ICNSEncoder.encode(buf)
    : Encoder.encode(buf)
}

export const decode = (
  buf: Buffer,
  options: { format?: string } = { format: 'default' }
): Buffer => {
  return options.format === 'icns'
    ? ICNSEncoder.decode(buf)
    : Encoder.decode(buf)
}

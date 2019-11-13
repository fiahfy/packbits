import * as Encoder from './encoder'
import * as ICNSEncoder from './icns-encoder'

export type PackBitsOptions = { format?: Format }
export type Format = 'default' | 'icns'

export const encode = (
  buf: Buffer,
  options: PackBitsOptions = { format: 'default' }
): Buffer => {
  return options.format === 'icns'
    ? ICNSEncoder.encode(buf)
    : Encoder.encode(buf)
}

export const decode = (
  buf: Buffer,
  options: PackBitsOptions = { format: 'default' }
): Buffer => {
  return options.format === 'icns'
    ? ICNSEncoder.decode(buf)
    : Encoder.decode(buf)
}

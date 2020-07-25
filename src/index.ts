import * as Encoder from './encoder'
import * as ICNSEncoder from './icns-encoder'

type Options = { format: Format }
type Format = 'default' | 'icns'

export const encode = (buf: Buffer, options: Partial<Options> = {}): Buffer => {
  const { format } = {
    ...{
      format: 'default',
    },
    ...options,
  }
  return format === 'icns' ? ICNSEncoder.encode(buf) : Encoder.encode(buf)
}

export const decode = (buf: Buffer, options: Partial<Options> = {}): Buffer => {
  const { format } = {
    ...{
      format: 'default',
    },
    ...options,
  }
  return format === 'icns' ? ICNSEncoder.decode(buf) : Encoder.decode(buf)
}

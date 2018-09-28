# @fiahfy/packbits

> [PackBits](https://en.wikipedia.org/wiki/PackBits) implementation in JavaScript.

## Installation
```
npm install @fiahfy/packbits
```

## Usage

### Encode
```js
import { encode } from '@fiahfy/packbits'

console.log(buf) // <Buffer aa bb bb cc cc cc dd dd dd dd>
const encoded = encode(buf)
console.log(encoded) // <Buffer 00 aa ff bb fe cc fd dd>
```

### Decode
```js
import { decode } from '@fiahfy/packbits'

console.log(buf) // <Buffer 00 aa ff bb fe cc fd dd>
const decoded = decode(buf)
console.log(decoded) // <Buffer aa bb bb cc cc cc dd dd dd dd>
```

## ICNS support
In [Apple Icon Image format](https://en.wikipedia.org/wiki/Apple_Icon_Image_format), pixel data are often compressed (per channel) with a format similar to PackBits.

### Encode
```js
import { encode } from '@fiahfy/packbits'

console.log(buf) // <Buffer aa bb bb cc cc cc dd dd dd dd>
const encoded = encode(buf, { icns: true })
console.log(encoded) // <Buffer 02 aa bb bb 80 cc 81 dd>
```

### Decode
```js
import { decode } from '@fiahfy/packbits'

console.log(buf) // <Buffer 02 aa bb bb 80 cc 81 dd>
const decoded = decode(buf, { icns: true })
console.log(decoded) // <Buffer aa bb bb cc cc cc dd dd dd dd>
```

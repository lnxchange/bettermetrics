import { deflateSync } from 'zlib'

import { AimIcon } from '@/lib/aim-icon'

/**
 * PNG and ICO encodings of {@link AimIcon}. Browsers request these files;
 * the pixels always come from the red A, never from a stretched bitmap.
 */
export class AimIconFile {
  static png(size: number): Buffer {
    const pixels = AimIcon.pixels(size)
    return AimIconFile.encodePng(size, size, pixels)
  }

  /** Multi-resolution icon: 16, 32 and 48 of the same mark. */
  static ico(sizes: readonly number[] = AimIcon.icoSizes): Buffer {
    const images = sizes.map(size => AimIconFile.png(size))
    const header = Buffer.alloc(6)
    header.writeUInt16LE(0, 0)
    header.writeUInt16LE(1, 2)
    header.writeUInt16LE(images.length, 4)
    const entries = Buffer.alloc(16 * images.length)
    let offset = 6 + entries.length
    images.forEach((image, index) => {
      const size = sizes[index]
      const at = index * 16
      entries[at] = size >= 256 ? 0 : size
      entries[at + 1] = size >= 256 ? 0 : size
      entries.writeUInt16LE(1, at + 4)
      entries.writeUInt16LE(32, at + 6)
      entries.writeUInt32LE(image.length, at + 8)
      entries.writeUInt32LE(offset, at + 12)
      offset += image.length
    })
    return Buffer.concat([header, entries, ...images])
  }

  private static encodePng(
    width: number,
    height: number,
    pixels: Uint8Array
  ): Buffer {
    const stride = width * 4
    const raw = Buffer.alloc(height * (1 + stride))
    for (let y = 0; y < height; y++) {
      const start = y * (1 + stride)
      raw[start] = 0
      Buffer.from(pixels.buffer, pixels.byteOffset + y * stride, stride).copy(
        raw,
        start + 1
      )
    }
    const ihdr = Buffer.alloc(13)
    ihdr.writeUInt32BE(width, 0)
    ihdr.writeUInt32BE(height, 4)
    ihdr[8] = 8
    ihdr[9] = 6
    return Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      AimIconFile.chunk('IHDR', ihdr),
      AimIconFile.chunk('IDAT', deflateSync(raw)),
      AimIconFile.chunk('IEND', Buffer.alloc(0))
    ])
  }

  private static chunk(type: string, data: Buffer): Buffer {
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)
    const body = Buffer.concat([Buffer.from(type), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(AimIconFile.crc32(body))
    return Buffer.concat([length, body, crc])
  }

  private static crc32(data: Buffer): number {
    let crc = 0xffffffff
    for (let i = 0; i < data.length; i++) {
      crc ^= data[i]
      for (let bit = 0; bit < 8; bit++) {
        crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
      }
    }
    return (crc ^ 0xffffffff) >>> 0
  }
}

import { AIM_SOURCE_COLORS } from '@/lib/aim-colors'
import { AimWordmark } from '@/lib/aim-wordmark'

type Point = { x: number; y: number }

type Bounds = { x: number; y: number; width: number; height: number }

type Rgb = { r: number; g: number; b: number }

/**
 * Square icons painted from the red A in the header wordmark.
 *
 * The full AIM wordmark is about 2.4 times as wide as it is tall. Fitted onto a
 * 16 or 32 pixel square without stretching, the letters are only a few pixels
 * high and stop reading as AIM. The A is almost square, so it keeps its shape
 * and stays recognisable at those sizes. Every icon uses that one letterform,
 * one uniform scale, and the header's white ground so the red reads on both
 * light and dark browser tabs.
 */
export class AimIcon {
  /** Share of each edge left clear. The letter never touches the canvas. */
  static readonly padding = 1 / 8

  static readonly background: Rgb = { r: 255, g: 255, b: 255 }

  static readonly color: Rgb = AimIcon.hex(AIM_SOURCE_COLORS.appetites)

  /** Supersample factor. Small sizes need it so the counter of the A survives. */
  static readonly supersample = 8

  static readonly pngSizes = [16, 32, 48, 180, 192, 512] as const

  static readonly icoSizes = [16, 32, 48] as const

  static hex(value: string): Rgb {
    const match = /^#?([0-9a-f]{6})$/i.exec(value.trim())
    if (!match) throw new Error(`Expected a hex colour, got ${value}`)
    const n = parseInt(match[1], 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }

  /** SVG path contours. Supports the line commands the wordmark actually uses. */
  static contours(d: string): Point[][] {
    const tokens = d.match(
      /[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g
    )
    if (!tokens) return []
    const contours: Point[][] = []
    let i = 0
    let cmd = ''
    let cx = 0
    let cy = 0
    let sx = 0
    let sy = 0
    let current: Point[] | null = null
    const isCommand = (token: string) => /^[a-zA-Z]$/.test(token)
    const take = () => {
      const token = tokens[i++]
      if (token === undefined || isCommand(token))
        throw new Error(`Path ended inside ${cmd}`)
      return parseFloat(token)
    }
    while (i < tokens.length) {
      if (isCommand(tokens[i])) cmd = tokens[i++]
      const relative = cmd === cmd.toLowerCase()
      const op = cmd.toUpperCase()
      if (op === 'Z') {
        if (current && current.length) contours.push(current)
        current = null
        cx = sx
        cy = sy
        continue
      }
      if (op === 'M') {
        if (current && current.length) contours.push(current)
        const x = take()
        const y = take()
        cx = relative ? cx + x : x
        cy = relative ? cy + y : y
        sx = cx
        sy = cy
        current = [{ x: cx, y: cy }]
        cmd = relative ? 'l' : 'L'
        continue
      }
      if (!current) throw new Error(`Path command ${cmd} before a move`)
      if (op === 'L') {
        const x = take()
        const y = take()
        cx = relative ? cx + x : x
        cy = relative ? cy + y : y
        current.push({ x: cx, y: cy })
        continue
      }
      if (op === 'H') {
        const x = take()
        cx = relative ? cx + x : x
        current.push({ x: cx, y: cy })
        continue
      }
      if (op === 'V') {
        const y = take()
        cy = relative ? cy + y : y
        current.push({ x: cx, y: cy })
        continue
      }
      throw new Error(`Unsupported path command ${cmd}`)
    }
    if (current && current.length) contours.push(current)
    return contours
  }

  static bounds(contours: Point[][]): Bounds {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const contour of contours) {
      for (const point of contour) {
        minX = Math.min(minX, point.x)
        minY = Math.min(minY, point.y)
        maxX = Math.max(maxX, point.x)
        maxY = Math.max(maxY, point.y)
      }
    }
    if (!Number.isFinite(minX)) throw new Error('Cannot bound an empty path')
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
  }

  static letterContours(): Point[][] {
    return AimIcon.contours(AimWordmark.letters.appetites)
  }

  static letterBounds(): Bounds {
    return AimIcon.bounds(AimIcon.letterContours())
  }

  /** Union of A, I and M, used to show why the whole wordmark cannot be the favicon. */
  static wordmarkBounds(): Bounds {
    const contours = (
      Object.keys(AimWordmark.letters) as (keyof typeof AimWordmark.letters)[]
    ).flatMap(key => AimIcon.contours(AimWordmark.letters[key]))
    return AimIcon.bounds(contours)
  }

  /**
   * How big a path is once fitted to a square with uniform scale and padding.
   * Width and height share one scale, so a wide mark stays wide and short.
   */
  static fitted(bounds: Bounds, size: number, padding = AimIcon.padding) {
    const inner = size * (1 - 2 * padding)
    const scale = inner / Math.max(bounds.width, bounds.height)
    return {
      scale,
      width: bounds.width * scale,
      height: bounds.height * scale
    }
  }

  /** Uniform placement of the red A on a square canvas. */
  static placement(size: number) {
    const bounds = AimIcon.letterBounds()
    const fitted = AimIcon.fitted(bounds, size)
    return {
      scale: fitted.scale,
      x: (size - fitted.width) / 2,
      y: (size - fitted.height) / 2,
      bounds
    }
  }

  /** Square SVG of the favicon. One scale() value, so the letter cannot stretch. */
  static svg(size: number): string {
    const place = AimIcon.placement(size)
    const { bounds } = place
    const fill = AIM_SOURCE_COLORS.appetites
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
      `<rect width="${size}" height="${size}" fill="#ffffff"/>`,
      `<path fill="${fill}" transform="translate(${place.x} ${place.y}) scale(${
        place.scale
      }) translate(${-bounds.x} ${-bounds.y})" d="${
        AimWordmark.letters.appetites
      }"/>`,
      `</svg>`
    ].join('')
  }

  /** RGBA pixels, row-major, of the square favicon at `size`. */
  static pixels(size: number): Uint8Array {
    if (!Number.isInteger(size) || size < 1)
      throw new Error(`Icon size must be a positive integer, got ${size}`)
    const place = AimIcon.placement(size)
    const ss = AimIcon.supersample
    const sample = size * ss
    const map = (point: Point): Point => ({
      x: (place.x + (point.x - place.bounds.x) * place.scale) * ss,
      y: (place.y + (point.y - place.bounds.y) * place.scale) * ss
    })
    const coverage = AimIcon.cover(
      sample,
      sample,
      AimIcon.letterContours().map(contour => contour.map(map))
    )
    const out = new Uint8Array(size * size * 4)
    const { r, g, b } = AimIcon.color
    const bg = AimIcon.background
    const cell = ss * ss
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let sum = 0
        for (let oy = 0; oy < ss; oy++) {
          const row = (y * ss + oy) * sample + x * ss
          for (let ox = 0; ox < ss; ox++) sum += coverage[row + ox]
        }
        const c = sum / cell
        const i = (y * size + x) * 4
        out[i] = Math.round(r * c + bg.r * (1 - c))
        out[i + 1] = Math.round(g * c + bg.g * (1 - c))
        out[i + 2] = Math.round(b * c + bg.b * (1 - c))
        out[i + 3] = 255
      }
    }
    return out
  }

  /** Nonzero-winding coverage. 1 where the letter covers the sample, else 0. */
  private static cover(
    width: number,
    height: number,
    contours: Point[][]
  ): Uint8Array {
    const coverage = new Uint8Array(width * height)
    type Edge = { y0: number; y1: number; x0: number; x1: number; dir: number }
    const edges: Edge[] = []
    for (const contour of contours) {
      for (let i = 0; i < contour.length; i++) {
        const a = contour[i]
        const b = contour[(i + 1) % contour.length]
        if (a.y === b.y) continue
        const down = a.y < b.y
        edges.push({
          y0: down ? a.y : b.y,
          y1: down ? b.y : a.y,
          x0: down ? a.x : b.x,
          x1: down ? b.x : a.x,
          dir: down ? 1 : -1
        })
      }
    }
    const hits: { x: number; dir: number }[] = []
    for (let y = 0; y < height; y++) {
      const yMid = y + 0.5
      hits.length = 0
      for (const edge of edges) {
        if (yMid < edge.y0 || yMid >= edge.y1) continue
        const t = (yMid - edge.y0) / (edge.y1 - edge.y0)
        hits.push({ x: edge.x0 + t * (edge.x1 - edge.x0), dir: edge.dir })
      }
      hits.sort((p, q) => p.x - q.x)
      let wind = 0
      let index = 0
      while (index < hits.length) {
        const start = hits[index].x
        wind += hits[index].dir
        index++
        if (wind === 0) continue
        while (index < hits.length) {
          const end = hits[index].x
          wind += hits[index].dir
          index++
          if (wind !== 0) continue
          const x0 = Math.max(0, Math.ceil(start - 0.5))
          const x1 = Math.min(width, Math.ceil(end - 0.5))
          const row = y * width
          for (let x = x0; x < x1; x++) coverage[row + x] = 1
          break
        }
      }
    }
    return coverage
  }
}

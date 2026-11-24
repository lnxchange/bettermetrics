import { AIM_SOURCE_COLORS } from '@/lib/aim-colors'
import { AimWordmark } from '@/lib/aim-wordmark'

/**
 * The AIM feature-image filter.
 *
 * One brand treatment, three looks. Lex picks a look in the tool, then locks
 * it by changing {@link FeatureImage.locked}. Every number that defines a look
 * lives in {@link FeatureImage.presets}, so the same photograph and the same
 * preset always take the same path. Grain is a fixed hash of the pixel, not
 * Math.random. The work is canvas pixel maths rather than WebGL, because GPU
 * float precision would make two machines disagree.
 *
 * Colours come from the wordmark and the red A ({@link AIM_SOURCE_COLORS})
 * and from Tailwind `primary.600` (`#1E3A8A` in tailwind.config.js).
 */

export type Rgb = { r: number; g: number; b: number }

export type FeatureSizeId = 'card' | 'hero' | 'square'

export type FeaturePresetId = 'duotone' | 'wash' | 'signal'

export type FeatureFormat = 'jpeg' | 'webp'

export type FeatureSize = {
  id: FeatureSizeId
  width: number
  height: number
  label: string
}

type PresetBase = {
  id: FeaturePresetId
  name: string
  summary: string
  /** 0 leaves the photograph alone. 1 is the full look. */
  strength: number
}

export type DuotonePreset = PresetBase & {
  id: 'duotone'
  kind: 'duotone'
  contrast: number
  pivot: number
  /** How quickly shadows take the navy ink. Higher stays grey for longer. */
  shadowPower: number
  shadowAmount: number
  highlightPower: number
  highlightAmount: number
}

export type WashPreset = PresetBase & {
  id: 'wash'
  kind: 'wash'
  /** Share of the pixel pulled toward grey before the wash. */
  mute: number
  contrast: number
  pivot: number
  lift: number
  /** Soft-light strength of the appetites red across the frame. */
  wash: number
  /** Grain amplitude in channel units (0 to 255). */
  grain: number
  grainSeed: number
}

export type SignalPreset = PresetBase & {
  id: 'signal'
  kind: 'signal'
  contrast: number
  pivot: number
  ink: string
  paper: string
  /**
   * Source luminance below this is pulled toward the red A.
   * Measured before the contrast curve, so crushed shadows stay black
   * and only the darkest pockets take the red.
   */
  shadowReach: number
  shadowAmount: number
  /** Left rail as a fraction of the frame width. */
  railFraction: number
  railMin: number
}

export type FeaturePreset = DuotonePreset | WashPreset | SignalPreset

export type Cover = {
  x: number
  y: number
  scale: number
  scaledWidth: number
  scaledHeight: number
}

export class FeatureImage {
  /**
   * The look the site treats as the filter. The tool still offers all three,
   * and opens on this one. Change the id to lock a different preset.
   */
  static readonly locked: FeaturePresetId = 'signal'

  /**
   * Article pages render `featured_image_url` full width inside `max-w-4xl`
   * (56rem) with no separate art direction. The hero matches the social card's
   * 1200:630 ratio at double size, so one focal point serves the article and
   * the link preview. Square is the 1080 post.
   */
  static readonly sizes: readonly FeatureSize[] = [
    { id: 'card', width: 1200, height: 630, label: 'Social card' },
    { id: 'hero', width: 2400, height: 1260, label: 'Article hero' },
    { id: 'square', width: 1080, height: 1080, label: 'Square' }
  ]

  static readonly order: readonly FeaturePresetId[] = [
    'duotone',
    'wash',
    'signal'
  ]

  static readonly quality = { jpeg: 0.86, webp: 0.82 } as const

  /** Longest edge of the live preview. Exports use {@link FeatureImage.sizes}. */
  static readonly previewMaxEdge = 1400

  static readonly overlay = {
    margin: 0.045,
    markHeight: 0.086,
    platePad: 0.34,
    titleSize: 0.052,
    titleLines: 3,
    scrim: 'rgba(14, 27, 66, 0.78)'
  } as const

  static readonly ink = {
    red: AIM_SOURCE_COLORS.appetites,
    green: AIM_SOURCE_COLORS.intrinsic,
    blue: AIM_SOURCE_COLORS.mimetic,
    redSoft: AIM_SOURCE_COLORS.appetitesSoft,
    navy: '#1E3A8A',
    ink: '#141418',
    paper: '#F4F4F1',
    white: '#FFFFFF'
  } as const

  static readonly presets: { [K in FeaturePresetId]: FeaturePreset } = {
    duotone: {
      id: 'duotone',
      kind: 'duotone',
      name: 'Duotone',
      summary: 'Navy shadows and a red highlight. The middle stays grey.',
      strength: 1,
      contrast: 1.14,
      pivot: 0.5,
      shadowPower: 1.85,
      shadowAmount: 1,
      highlightPower: 1.55,
      highlightAmount: 0.82
    },
    wash: {
      id: 'wash',
      kind: 'wash',
      name: 'Grain wash',
      summary: 'A muted photograph, an appetites-red wash, and a fixed grain.',
      strength: 1,
      mute: 0.58,
      contrast: 0.92,
      pivot: 0.5,
      lift: 0.04,
      wash: 0.46,
      grain: 22,
      grainSeed: 0x41494d
    },
    signal: {
      id: 'signal',
      kind: 'signal',
      name: 'Mono signal',
      summary:
        'High contrast black and white, a red rail, and red only in the deepest shadows.',
      strength: 1,
      contrast: 1.55,
      pivot: 0.46,
      ink: '#141418',
      paper: '#F4F4F1',
      shadowReach: 0.08,
      shadowAmount: 0.45,
      railFraction: 0.007,
      railMin: 8
    }
  }

  static list(): FeaturePreset[] {
    return FeatureImage.order.map(id => FeatureImage.presets[id])
  }

  static preset(id: FeaturePresetId): FeaturePreset {
    return FeatureImage.presets[id]
  }

  static size(id: FeatureSizeId): FeatureSize {
    const found = FeatureImage.sizes.find(entry => entry.id === id)
    if (!found) throw new Error(`Unknown feature image size ${id}`)
    return found
  }

  static preview(size: FeatureSize, maxEdge = FeatureImage.previewMaxEdge) {
    const edge = Math.max(size.width, size.height)
    if (edge <= maxEdge) return { width: size.width, height: size.height }
    const scale = maxEdge / edge
    return {
      width: Math.max(1, Math.round(size.width * scale)),
      height: Math.max(1, Math.round(size.height * scale))
    }
  }

  static mime(format: FeatureFormat): string {
    return format === 'jpeg' ? 'image/jpeg' : 'image/webp'
  }

  static qualityFor(format: FeatureFormat): number {
    return FeatureImage.quality[format]
  }

  /** File name from the article slug. Empty slug falls back to aim-feature. */
  static filename(
    slug: string,
    preset: FeaturePresetId,
    size: FeatureSizeId,
    format: FeatureFormat
  ): string {
    const stem = FeatureImage.slug(slug) || 'aim-feature'
    const ext = format === 'jpeg' ? 'jpg' : 'webp'
    return `${stem}-${preset}-${size}.${ext}`
  }

  static slug(value: string): string {
    return value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
  }

  /**
   * Cover-crop window. The focal point is the source point that should sit
   * in the middle of the frame, clamped so the frame stays full.
   */
  static cover(
    sourceWidth: number,
    sourceHeight: number,
    frameWidth: number,
    frameHeight: number,
    focalX: number,
    focalY: number
  ): Cover {
    const safeWidth = Math.max(1, sourceWidth)
    const safeHeight = Math.max(1, sourceHeight)
    const scale = Math.max(frameWidth / safeWidth, frameHeight / safeHeight)
    const scaledWidth = safeWidth * scale
    const scaledHeight = safeHeight * scale
    const maxX = Math.max(0, scaledWidth - frameWidth)
    const maxY = Math.max(0, scaledHeight - frameHeight)
    const x = FeatureImage.clamp(
      FeatureImage.clamp01(focalX) * scaledWidth - frameWidth / 2,
      0,
      maxX
    )
    const y = FeatureImage.clamp(
      FeatureImage.clamp01(focalY) * scaledHeight - frameHeight / 2,
      0,
      maxY
    )
    return { x, y, scale, scaledWidth, scaledHeight }
  }

  /**
   * Apply a preset to RGBA pixels, row-major. `strength` blends back toward
   * the source. Alpha is flattened onto white first so a transparent PNG
   * cannot punch a hole in the export.
   */
  static treat(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    preset: FeaturePreset,
    strength: number
  ): void {
    const amount = FeatureImage.clamp01(strength)
    const rail =
      preset.kind === 'signal'
        ? Math.max(preset.railMin, Math.round(width * preset.railFraction))
        : 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        const flat = FeatureImage.flatten(
          pixels[i],
          pixels[i + 1],
          pixels[i + 2],
          pixels[i + 3]
        )
        const treated = FeatureImage.pixel(flat, x, y, preset, rail)
        const mixed = FeatureImage.mixRgb(flat, treated, amount)
        pixels[i] = FeatureImage.byte(mixed.r)
        pixels[i + 1] = FeatureImage.byte(mixed.g)
        pixels[i + 2] = FeatureImage.byte(mixed.b)
        pixels[i + 3] = 255
      }
    }
  }

  /** Draw the cropped, treated frame, then the optional title and wordmark. */
  static paint(
    ctx: CanvasRenderingContext2D,
    image: CanvasImageSource,
    sourceWidth: number,
    sourceHeight: number,
    options: {
      preset: FeaturePreset
      strength: number
      focalX: number
      focalY: number
      mark: boolean
      title: string
    }
  ): void {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const cover = FeatureImage.cover(
      sourceWidth,
      sourceHeight,
      width,
      height,
      options.focalX,
      options.focalY
    )
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(
      image,
      -cover.x,
      -cover.y,
      cover.scaledWidth,
      cover.scaledHeight
    )
    const frame = ctx.getImageData(0, 0, width, height)
    FeatureImage.treat(
      frame.data,
      width,
      height,
      options.preset,
      options.strength
    )
    ctx.putImageData(frame, 0, 0)
    const title = options.title.replace(/\s+/g, ' ').trim()
    if (title) FeatureImage.drawTitle(ctx, title, options.mark)
    if (options.mark) FeatureImage.drawMark(ctx)
  }

  static rgb(hex: string): Rgb {
    const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
    if (!match) throw new Error(`Expected a hex colour, got ${hex}`)
    const n = parseInt(match[1], 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }

  /** Deterministic grain in -1..1. The same pixel and seed always match. */
  static grain(x: number, y: number, seed: number): number {
    let n =
      Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263) ^ (seed | 0)
    n = Math.imul(n ^ (n >>> 13), 1274126177)
    n = n ^ (n >>> 16)
    return ((n >>> 0) % 10001) / 5000 - 1
  }

  private static pixel(
    source: Rgb,
    x: number,
    y: number,
    preset: FeaturePreset,
    rail: number
  ): Rgb {
    if (preset.kind === 'duotone') return FeatureImage.duotone(source, preset)
    if (preset.kind === 'wash') return FeatureImage.wash(source, x, y, preset)
    return FeatureImage.signal(source, x, preset, rail)
  }

  private static duotone(source: Rgb, preset: DuotonePreset): Rgb {
    const tone = FeatureImage.curve(
      FeatureImage.luminance(source.r, source.g, source.b),
      preset.contrast,
      preset.pivot
    )
    const grey = tone * 255
    let out: Rgb = { r: grey, g: grey, b: grey }
    const shadow = Math.pow(1 - tone, preset.shadowPower) * preset.shadowAmount
    const highlight =
      Math.pow(tone, preset.highlightPower) * preset.highlightAmount
    out = FeatureImage.mixRgb(
      out,
      FeatureImage.rgb(FeatureImage.ink.navy),
      shadow
    )
    out = FeatureImage.mixRgb(
      out,
      FeatureImage.rgb(FeatureImage.ink.red),
      highlight
    )
    return out
  }

  private static wash(
    source: Rgb,
    x: number,
    y: number,
    preset: WashPreset
  ): Rgb {
    const lum = FeatureImage.luminance(source.r, source.g, source.b)
    const grey = lum * 255
    const muted = FeatureImage.mixRgb(
      source,
      { r: grey, g: grey, b: grey },
      preset.mute
    )
    const curved = FeatureImage.curve(
      FeatureImage.luminance(muted.r, muted.g, muted.b),
      preset.contrast,
      preset.pivot
    )
    const lifted = FeatureImage.clamp01(curved + preset.lift)
    const tone = lifted * 255
    const levelled = FeatureImage.mixRgb(
      muted,
      { r: tone, g: tone, b: tone },
      0.55
    )
    const out = FeatureImage.softLight(
      levelled,
      FeatureImage.rgb(FeatureImage.ink.red),
      preset.wash
    )
    const amp = preset.grain
    return {
      r: out.r + FeatureImage.grain(x, y, preset.grainSeed) * amp,
      g: out.g + FeatureImage.grain(x, y, preset.grainSeed + 101) * amp,
      b: out.b + FeatureImage.grain(x, y, preset.grainSeed + 307) * amp
    }
  }

  private static signal(
    source: Rgb,
    x: number,
    preset: SignalPreset,
    rail: number
  ): Rgb {
    if (x < rail) return FeatureImage.rgb(FeatureImage.ink.red)
    const sourceLum = FeatureImage.luminance(source.r, source.g, source.b)
    const tone = FeatureImage.curve(sourceLum, preset.contrast, preset.pivot)
    let out = FeatureImage.mixRgb(
      FeatureImage.rgb(preset.ink),
      FeatureImage.rgb(preset.paper),
      tone
    )
    if (sourceLum < preset.shadowReach) {
      const pull = (1 - sourceLum / preset.shadowReach) * preset.shadowAmount
      out = FeatureImage.mixRgb(
        out,
        FeatureImage.rgb(FeatureImage.ink.red),
        pull
      )
    }
    return out
  }

  private static drawTitle(
    ctx: CanvasRenderingContext2D,
    title: string,
    mark: boolean
  ): void {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const box = FeatureImage.markBox(width, height)
    const maxWidth = mark
      ? Math.max(40, box.plateX - box.margin * 2)
      : width - box.margin * 2
    const size = box.titleSize
    ctx.save()
    ctx.font = `700 ${size}px ${FeatureImage.font}`
    ctx.textBaseline = 'top'
    const lines = FeatureImage.wrap(
      ctx,
      title,
      maxWidth,
      FeatureImage.overlay.titleLines
    )
    if (!lines.length) {
      ctx.restore()
      return
    }
    const lineHeight = size * 1.18
    const block = lines.length * lineHeight
    const ruleH = Math.max(3, Math.round(size * 0.1))
    const ruleW = Math.round(size * 2.15)
    const gap = Math.round(size * 0.38)
    const textY = height - box.margin - block
    const ruleY = textY - gap - ruleH
    const scrimTop = Math.max(0, ruleY - size)
    const gradient = ctx.createLinearGradient(0, scrimTop, 0, height)
    gradient.addColorStop(0, 'rgba(14, 27, 66, 0)')
    gradient.addColorStop(0.42, FeatureImage.overlay.scrim)
    gradient.addColorStop(1, 'rgba(14, 27, 66, 0.9)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, scrimTop, width, height - scrimTop)
    ctx.fillStyle = FeatureImage.ink.red
    ctx.fillRect(box.margin, ruleY, ruleW, ruleH)
    ctx.fillStyle = FeatureImage.ink.white
    lines.forEach((line, index) => {
      ctx.fillText(line, box.margin, textY + index * lineHeight)
    })
    ctx.restore()
  }

  private static drawMark(ctx: CanvasRenderingContext2D): void {
    const box = FeatureImage.markBox(ctx.canvas.width, ctx.canvas.height)
    const radius = Math.round(box.plateHeight * 0.16)
    ctx.save()
    FeatureImage.roundedRect(
      ctx,
      box.plateX,
      box.plateY,
      box.plateWidth,
      box.plateHeight,
      radius
    )
    ctx.fillStyle = FeatureImage.ink.white
    ctx.fill()
    ctx.lineWidth = Math.max(2, Math.round(box.plateHeight * 0.035))
    ctx.strokeStyle = FeatureImage.ink.navy
    ctx.stroke()
    const scale = box.markWidth / AimWordmark.frame.width
    ctx.translate(box.plateX + box.pad, box.plateY + box.pad)
    ctx.scale(scale, scale)
    ctx.translate(-AimWordmark.frame.x, -AimWordmark.frame.y)
    const letters = [
      [AimWordmark.letters.appetites, FeatureImage.ink.red],
      [AimWordmark.letters.intrinsic, FeatureImage.ink.green],
      [AimWordmark.letters.mimetic, FeatureImage.ink.blue]
    ] as const
    for (const [path, fill] of letters) {
      ctx.fillStyle = fill
      ctx.fill(new Path2D(path))
    }
    ctx.restore()
  }

  private static markBox(width: number, height: number) {
    const margin = Math.round(
      Math.min(width, height) * FeatureImage.overlay.margin
    )
    const markHeight = Math.round(height * FeatureImage.overlay.markHeight)
    const aspect = AimWordmark.frame.width / AimWordmark.frame.height
    const markWidth = Math.round(markHeight * aspect)
    const pad = Math.round(markHeight * FeatureImage.overlay.platePad)
    const plateWidth = markWidth + pad * 2
    const plateHeight = markHeight + pad * 2
    return {
      margin,
      markHeight,
      markWidth,
      pad,
      plateWidth,
      plateHeight,
      plateX: width - margin - plateWidth,
      plateY: height - margin - plateHeight,
      titleSize: Math.max(
        18,
        Math.round(height * FeatureImage.overlay.titleSize)
      )
    }
  }

  private static wrap(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number
  ): string[] {
    const words = text.split(' ').filter(Boolean)
    if (!words.length || maxLines < 1) return []
    const lines: string[] = []
    let current = ''
    let index = 0
    const widthOf = (value: string) => ctx.measureText(value).width
    while (index < words.length) {
      const word = words[index]
      const trial = current ? `${current} ${word}` : word
      if (widthOf(trial) <= maxWidth || !current) {
        current = trial
        index += 1
        if (index === words.length) lines.push(current)
        continue
      }
      lines.push(current)
      current = ''
      if (lines.length === maxLines) break
    }
    if (index < words.length && lines.length) {
      lines[lines.length - 1] = FeatureImage.ellipsize(
        ctx,
        lines[lines.length - 1],
        maxWidth
      )
    }
    return lines.map(line =>
      widthOf(line) <= maxWidth
        ? line
        : FeatureImage.ellipsize(ctx, line, maxWidth)
    )
  }

  private static ellipsize(
    ctx: CanvasRenderingContext2D,
    line: string,
    maxWidth: number
  ): string {
    const mark = '…'
    let cut = line.trimEnd()
    while (
      cut.length > 0 &&
      ctx.measureText(`${cut}${mark}`).width > maxWidth
    ) {
      cut = cut.slice(0, -1).trimEnd()
    }
    return cut ? `${cut}${mark}` : mark
  }

  private static roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2))
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + width, y, x + width, y + height, r)
    ctx.arcTo(x + width, y + height, x, y + height, r)
    ctx.arcTo(x, y + height, x, y, r)
    ctx.arcTo(x, y, x + width, y, r)
    ctx.closePath()
  }

  private static flatten(r: number, g: number, b: number, a: number): Rgb {
    if (a >= 255) return { r, g, b }
    const u = a / 255
    return {
      r: r * u + 255 * (1 - u),
      g: g * u + 255 * (1 - u),
      b: b * u + 255 * (1 - u)
    }
  }

  private static luminance(r: number, g: number, b: number): number {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  }

  private static curve(value: number, contrast: number, pivot: number): number {
    return FeatureImage.clamp01((value - pivot) * contrast + pivot)
  }

  private static mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
    const u = FeatureImage.clamp01(t)
    return {
      r: a.r + (b.r - a.r) * u,
      g: a.g + (b.g - a.g) * u,
      b: a.b + (b.b - a.b) * u
    }
  }

  private static softLight(base: Rgb, blend: Rgb, amount: number): Rgb {
    const channel = (from: number, toward: number) => {
      const b = from / 255
      const s = toward / 255
      const out =
        s <= 0.5
          ? b - (1 - 2 * s) * b * (1 - b)
          : b +
            (2 * s - 1) *
              ((b <= 0.25 ? ((16 * b - 12) * b + 4) * b : Math.sqrt(b)) - b)
      return out * 255
    }
    const lit = {
      r: channel(base.r, blend.r),
      g: channel(base.g, blend.g),
      b: channel(base.b, blend.b)
    }
    return FeatureImage.mixRgb(base, lit, amount)
  }

  private static font =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'

  private static clamp01(value: number): number {
    return FeatureImage.clamp(value, 0, 1)
  }

  private static clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
  }

  private static byte(value: number): number {
    if (value <= 0) return 0
    if (value >= 255) return 255
    return Math.round(value)
  }
}

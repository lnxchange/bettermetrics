import {
  FeatureFormat,
  FeatureImage,
  FeaturePresetId,
  FeatureSizeId
} from '@/lib/feature-image'

/**
 * The feature-image tool. One mount point, used by the site route and by the
 * offline HTML file. The photograph is read with a local object URL and drawn
 * on a canvas. Nothing is sent anywhere.
 */
export class FeatureImageApp {
  static readonly css = `
.aim-feature {
  box-sizing: border-box;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2.25rem 1.25rem 4rem;
  color: #18181b;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  line-height: 1.5;
}
.aim-feature *, .aim-feature *::before, .aim-feature *::after { box-sizing: border-box; }
.aim-feature h1 {
  margin: 0 0 0.6rem;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #18181b;
}
.aim-feature p { margin: 0; }
.af-lead { max-width: 42rem; color: #3f3f46; font-size: 1.05rem; }
.af-lead strong { color: #18181b; font-weight: 650; }
.af-drop {
  margin-top: 1.5rem;
  padding: 1.6rem 1.25rem;
  border: 1.5px dashed #c4c4cc;
  border-radius: 0.9rem;
  background: #fff;
  text-align: center;
}
.aim-feature.af-has-photo .af-drop { padding: 0.85rem 1rem; }
.af-drop.af-over { border-color: #C62828; background: #FCECEC; }
.af-drop p { color: #3f3f46; }
.af-file { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.af-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; margin-top: 0.85rem; }
.aim-feature.af-has-photo .af-actions { margin-top: 0.55rem; }
.af-btn, .af-choice, .af-preset {
  font: inherit;
  cursor: pointer;
  border-radius: 0.6rem;
}
.af-btn {
  border: 1px solid #1E3A8A;
  background: #1E3A8A;
  color: #fff;
  padding: 0.55rem 0.95rem;
  font-weight: 650;
}
.af-btn:hover { background: #16306f; }
.af-btn:disabled, .af-choice:disabled { opacity: 0.45; cursor: not-allowed; }
.af-btn-ghost {
  border: 1px solid #d4d4d8;
  background: #fff;
  color: #18181b;
  font-weight: 600;
}
.af-btn-ghost:hover { border-color: #1E3A8A; }
.af-btn-red { border-color: #C62828; background: #C62828; }
.af-btn-red:hover { background: #a82222; }
.af-stage {
  margin-top: 1.25rem;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 0.9rem;
  overflow: hidden;
}
.af-frame { position: relative; background: #ececee; }
.af-frame canvas { display: block; width: 100%; height: auto; border: 0; cursor: grab; touch-action: none; }
.af-frame canvas:active { cursor: grabbing; }
.af-cross {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1.25rem;
  height: 1.25rem;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.af-cross::before, .af-cross::after {
  content: "";
  position: absolute;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(20, 20, 24, 0.85);
}
.af-cross::before { left: 50%; top: 0; width: 1px; height: 100%; }
.af-cross::after { top: 50%; left: 0; height: 1px; width: 100%; }
.af-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 16rem;
  aspect-ratio: 1200 / 630;
  padding: 1.5rem;
  color: #52525b;
  text-align: center;
}
.aim-feature.af-has-photo .af-empty { display: none; }
.aim-feature:not(.af-has-photo) .af-frame canvas,
.aim-feature:not(.af-has-photo) .af-cross { display: none; }
.af-caption {
  padding: 0.7rem 1rem;
  color: #52525b;
  font-size: 0.92rem;
  border-top: 1px solid #e4e4e7;
}
.af-panel {
  margin-top: 1rem;
  padding: 1rem 1rem 1.1rem;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 0.9rem;
}
.af-label {
  display: block;
  margin-bottom: 0.55rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3f3f46;
}
.af-presets { display: grid; gap: 0.7rem; grid-template-columns: 1fr; }
@media (min-width: 800px) {
  .af-presets { grid-template-columns: repeat(3, 1fr); }
}
.af-preset {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 0.75rem;
  text-align: left;
  border: 1.5px solid #e4e4e7;
  background: #fff;
  color: #18181b;
}
.af-preset:hover { border-color: #1E3A8A; }
.af-preset[aria-pressed="true"] { border-color: #C62828; box-shadow: inset 0 0 0 1px #C62828; }
.af-swatch { display: block; width: 100%; height: 0.55rem; border-radius: 999px; }
.af-swatch-duotone { background: linear-gradient(90deg, #1E3A8A 0%, #8d8d93 48%, #C62828 100%); }
.af-swatch-wash { background: linear-gradient(90deg, #d9d3cc, #e7c3bf 42%, #C62828); }
.af-swatch-signal { background: linear-gradient(90deg, #C62828 0 8%, #141418 8% 40%, #F4F4F1 100%); }
.af-preset-name { font-weight: 700; }
.af-badge {
  margin-left: 0.4rem;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: #FCECEC;
  color: #C62828;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  vertical-align: 0.1em;
}
.af-preset-copy { color: #52525b; font-size: 0.92rem; }
.af-grid { display: grid; gap: 0.9rem 1.1rem; }
@media (min-width: 800px) {
  .af-grid-3 { grid-template-columns: 1.3fr 1fr 1fr; }
  .af-grid-2 { grid-template-columns: 1fr 1fr; }
}
.af-field label, .af-check { font-weight: 650; color: #18181b; }
.af-field input[type="range"] { width: 100%; accent-color: #C62828; }
.af-value { float: right; color: #52525b; font-weight: 600; font-variant-numeric: tabular-nums; }
.af-hint { display: block; margin-top: 0.2rem; color: #71717a; font-size: 0.85rem; font-weight: 450; }
.af-checks { display: flex; flex-wrap: wrap; gap: 0.8rem 1.4rem; }
.af-check { display: flex; gap: 0.5rem; align-items: flex-start; }
.af-check input { margin-top: 0.3rem; accent-color: #C62828; }
.af-text, .af-field input[type="text"] {
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid #d4d4d8;
  border-radius: 0.55rem;
  background: #fff;
  color: #18181b;
  font: inherit;
}
.af-text:focus, .af-btn:focus-visible, .af-preset:focus-visible, .af-choice:focus-visible {
  outline: 2px solid #1E3A8A;
  outline-offset: 2px;
}
.af-formats { display: flex; gap: 0.5rem; }
.af-choice {
  border: 1px solid #d4d4d8;
  background: #fff;
  color: #18181b;
  padding: 0.45rem 0.8rem;
  font-weight: 650;
}
.af-choice[aria-pressed="true"] { border-color: #1E3A8A; background: #1E3A8A; color: #fff; }
.af-exports { display: grid; gap: 0.7rem; margin-top: 0.8rem; }
@media (min-width: 800px) {
  .af-exports { grid-template-columns: repeat(3, 1fr); }
}
.af-export {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.45rem;
  padding: 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.7rem;
  background: #fafafa;
}
.af-export[data-current="true"] { border-color: #C62828; background: #fff; }
.af-export-size { color: #52525b; font-size: 0.85rem; }
.af-export-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.35;
  color: #3f3f46;
  overflow-wrap: anywhere;
}
.af-note { margin-top: 0.75rem; color: #52525b; font-size: 0.92rem; }
.af-status { min-height: 1.4rem; margin-top: 0.8rem; color: #3f3f46; }
.af-status.af-bad { color: #C62828; }
.aim-feature button, .aim-feature input { font-family: inherit; }
`

  static mount(root: HTMLElement): () => void {
    const session = new FeatureImageSession(root)
    session.open()
    return () => session.close()
  }
}

type SessionState = {
  preset: FeaturePresetId
  strength: number
  focalX: number
  focalY: number
  mark: boolean
  titleOn: boolean
  title: string
  slug: string
  format: FeatureFormat
  preview: FeatureSizeId
}

class FeatureImageSession {
  private root: HTMLElement
  private image: HTMLImageElement | null = null
  private frame = 0
  private dragging: {
    id: number
    x: number
    y: number
    focalX: number
    focalY: number
    coverX: number
    coverY: number
    scaledWidth: number
    scaledHeight: number
  } | null = null
  private state: SessionState
  private nodes!: {
    file: HTMLInputElement
    drop: HTMLElement
    canvas: HTMLCanvasElement
    caption: HTMLElement
    strength: HTMLInputElement
    strengthValue: HTMLElement
    focalX: HTMLInputElement
    focalY: HTMLInputElement
    focalXValue: HTMLElement
    focalYValue: HTMLElement
    mark: HTMLInputElement
    titleOn: HTMLInputElement
    title: HTMLInputElement
    slug: HTMLInputElement
    status: HTMLElement
    names: HTMLElement[]
  }
  private onDragOver = (event: DragEvent) => {
    if (!this.hasFiles(event)) return
    event.preventDefault()
    this.nodes.drop.classList.add('af-over')
  }
  private onDragLeave = () => {
    this.nodes.drop.classList.remove('af-over')
  }
  private onDocDragOver = (event: DragEvent) => {
    if (!this.hasFiles(event)) return
    event.preventDefault()
  }
  private onDocDrop = (event: DragEvent) => {
    if (!this.hasFiles(event)) return
    event.preventDefault()
    this.nodes.drop.classList.remove('af-over')
    const file = event.dataTransfer?.files[0]
    if (file) void this.load(file)
  }

  constructor(root: HTMLElement) {
    const locked = FeatureImage.preset(FeatureImage.locked)
    this.root = root
    this.state = {
      preset: locked.id,
      strength: locked.strength,
      focalX: 0.5,
      focalY: 0.5,
      mark: true,
      titleOn: false,
      title: '',
      slug: '',
      format: 'jpeg',
      preview: 'card'
    }
  }

  open(): void {
    const locked = FeatureImage.locked
    const lockedPreset = FeatureImage.preset(locked)
    const presets = FeatureImage.list()
      .map(preset => {
        const badge =
          preset.id === locked
            ? '<span class="af-badge">Site filter</span>'
            : ''
        return `<button type="button" class="af-preset" data-preset="${
          preset.id
        }" aria-pressed="${preset.id === locked}">
          <span class="af-swatch af-swatch-${preset.id}"></span>
          <span class="af-preset-name">${preset.name}${badge}</span>
          <span class="af-preset-copy">${preset.summary}</span>
        </button>`
      })
      .join('')

    this.root.className = 'aim-feature'
    this.root.innerHTML = `
      <style>${FeatureImageApp.css}</style>
      <h1>Feature image</h1>
      <p class="af-lead">Turn a landscape, a texture or a building into an article image in the AIM colours. <strong>The photograph stays in this browser.</strong> It is never uploaded, and this tool does not generate pictures.</p>
      <div class="af-drop" data-drop>
        <p data-drop-copy>Drop a photograph here, or choose a file.</p>
        <div class="af-actions">
          <button type="button" class="af-btn" data-pick>Choose a photograph</button>
        </div>
        <input class="af-file" type="file" accept="image/*" data-file />
      </div>
      <div class="af-stage">
        <div class="af-frame">
          <div class="af-empty">Your photograph will show here, in the social-card crop.</div>
          <canvas data-canvas aria-label="Feature image preview"></canvas>
          <div class="af-cross" aria-hidden="true"></div>
        </div>
        <p class="af-caption" data-caption>Drag the picture to move the crop. The cross marks the middle. The article hero uses this same shape at double size.</p>
      </div>
      <section class="af-panel" aria-label="Look">
        <span class="af-label">Look</span>
        <div class="af-presets">${presets}</div>
      </section>
      <section class="af-panel">
        <div class="af-grid af-grid-3">
          <div class="af-field">
            <label for="af-strength">Strength <span class="af-value" data-strength-value>100%</span></label>
            <input id="af-strength" data-strength type="range" min="0" max="100" step="1" value="100" />
            <span class="af-hint">How far the photograph moves toward the look.</span>
          </div>
          <div class="af-field">
            <label for="af-focal-x">Horizontal focus <span class="af-value" data-focal-x-value>50%</span></label>
            <input id="af-focal-x" data-focal-x type="range" min="0" max="100" step="1" value="50" />
          </div>
          <div class="af-field">
            <label for="af-focal-y">Vertical focus <span class="af-value" data-focal-y-value>50%</span></label>
            <input id="af-focal-y" data-focal-y type="range" min="0" max="100" step="1" value="50" />
          </div>
        </div>
        <p class="af-hint" style="margin-top:0.7rem">Focus is the point of the photograph that stays in the middle of the crop.</p>
      </section>
      <section class="af-panel">
        <span class="af-label">Overlays</span>
        <div class="af-checks">
          <label class="af-check"><input type="checkbox" data-mark checked /> <span>AIM mark<br /><span class="af-hint">Small wordmark in the corner. A is red, I is green, M is blue.</span></span></label>
          <label class="af-check"><input type="checkbox" data-title-on /> <span>Article title<br /><span class="af-hint">A title band for the social card.</span></span></label>
        </div>
        <div class="af-grid af-grid-2" style="margin-top:0.9rem">
          <div class="af-field">
            <label for="af-title">Article title</label>
            <input id="af-title" class="af-text" data-title type="text" maxlength="140" placeholder="What the mixing hides" />
          </div>
          <div class="af-field">
            <label for="af-slug">Article slug</label>
            <input id="af-slug" class="af-text" data-slug type="text" maxlength="80" spellcheck="false" placeholder="what-the-mixing-hides" autocapitalize="off" />
            <span class="af-hint">Used in the file name. Leave it blank and the file is called aim-feature.</span>
          </div>
        </div>
      </section>
      <section class="af-panel" aria-label="Export">
        <span class="af-label">Export</span>
        <div class="af-formats" data-formats>
          <button type="button" class="af-choice" data-format="jpeg" aria-pressed="true">JPEG</button>
          <button type="button" class="af-choice" data-format="webp" aria-pressed="false">WebP</button>
        </div>
        <div class="af-exports" data-exports></div>
        <p class="af-note">Social card 1200 × 630 matches the site Open Graph image. Article hero 2400 × 1260 is that crop at double size: the article page shows the featured image full width of the 56 rem column, with no second crop. Square is 1080 × 1080. JPEG is saved at 86% and WebP at 82%.</p>
        <p class="af-note">The same photograph and the same look always produce the same picture. Grain is fixed, not random. To lock a different look as the site filter, change the locked preset in lib/feature-image.ts. ${lockedPreset.name} is locked now.</p>
        <p class="af-status" data-status role="status"></p>
      </section>
    `

    const need = <T extends Element>(selector: string) => {
      const node = this.root.querySelector(selector)
      if (!node) throw new Error(`Missing ${selector}`)
      return node as T
    }
    this.nodes = {
      file: need('input[data-file]'),
      drop: need('[data-drop]'),
      canvas: need('canvas'),
      caption: need('[data-caption]'),
      strength: need('input[data-strength]'),
      strengthValue: need('[data-strength-value]'),
      focalX: need('input[data-focal-x]'),
      focalY: need('input[data-focal-y]'),
      focalXValue: need('[data-focal-x-value]'),
      focalYValue: need('[data-focal-y-value]'),
      mark: need('input[data-mark]'),
      titleOn: need('input[data-title-on]'),
      title: need('input[data-title]'),
      slug: need('input[data-slug]'),
      status: need('[data-status]'),
      names: []
    }
    this.buildExports()
    this.bind()
    this.sync()
    void this.detectWebp()
  }

  close(): void {
    cancelAnimationFrame(this.frame)
    this.nodes.drop.removeEventListener('dragover', this.onDragOver)
    this.nodes.drop.removeEventListener('dragleave', this.onDragLeave)
    document.removeEventListener('dragover', this.onDocDragOver)
    document.removeEventListener('drop', this.onDocDrop)
    this.root.replaceChildren()
    this.root.className = ''
  }

  private bind(): void {
    this.nodes.drop.addEventListener('dragover', this.onDragOver)
    this.nodes.drop.addEventListener('dragleave', this.onDragLeave)
    document.addEventListener('dragover', this.onDocDragOver)
    document.addEventListener('drop', this.onDocDrop)
    this.root.querySelector('[data-pick]')?.addEventListener('click', () => {
      this.nodes.file.click()
    })
    this.nodes.file.addEventListener('change', () => {
      const file = this.nodes.file.files?.[0]
      if (file) void this.load(file)
      this.nodes.file.value = ''
    })
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-preset]')
      .forEach(button => {
        button.addEventListener('click', () => {
          const id = button.dataset.preset as FeaturePresetId
          const preset = FeatureImage.preset(id)
          this.state.preset = id
          this.state.strength = preset.strength
          this.sync()
          this.render()
        })
      })
    this.nodes.strength.addEventListener('input', () => {
      this.state.strength = Number(this.nodes.strength.value) / 100
      this.sync()
      this.render()
    })
    this.nodes.focalX.addEventListener('input', () => {
      this.state.focalX = Number(this.nodes.focalX.value) / 100
      this.sync()
      this.render()
    })
    this.nodes.focalY.addEventListener('input', () => {
      this.state.focalY = Number(this.nodes.focalY.value) / 100
      this.sync()
      this.render()
    })
    this.nodes.mark.addEventListener('change', () => {
      this.state.mark = this.nodes.mark.checked
      this.render()
    })
    this.nodes.titleOn.addEventListener('change', () => {
      this.state.titleOn = this.nodes.titleOn.checked
      this.render()
    })
    this.nodes.title.addEventListener('input', () => {
      this.state.title = this.nodes.title.value
      if (this.state.title.trim()) this.state.titleOn = true
      this.nodes.titleOn.checked = this.state.titleOn
      this.render()
    })
    this.nodes.slug.addEventListener('input', () => {
      this.state.slug = this.nodes.slug.value
      this.sync()
    })
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-format]')
      .forEach(button => {
        button.addEventListener('click', () => {
          this.state.format = button.dataset.format as FeatureFormat
          this.sync()
        })
      })
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-size]')
      .forEach(button => {
        button.addEventListener('click', () => {
          const id = button.dataset.size as FeatureSizeId
          if (button.dataset.role === 'preview') {
            this.state.preview = id
            this.sync()
            this.render()
            return
          }
          void this.exportSize(id)
        })
      })
    const canvas = this.nodes.canvas
    canvas.addEventListener('pointerdown', event => this.pointerDown(event))
    canvas.addEventListener('pointermove', event => this.pointerMove(event))
    canvas.addEventListener('pointerup', event => this.pointerUp(event))
    canvas.addEventListener('pointercancel', event => this.pointerUp(event))
  }

  private buildExports(): void {
    const host = this.root.querySelector('[data-exports]')
    if (!host) return
    host.innerHTML = FeatureImage.sizes
      .map(size => {
        const pressed = size.id === this.state.preview
        return `<div class="af-export" data-current="${pressed}" data-card="${size.id}">
          <strong>${size.label}</strong>
          <span class="af-export-size">${size.width} × ${size.height}</span>
          <button type="button" class="af-btn af-btn-ghost" data-size="${size.id}" data-role="preview" aria-pressed="${pressed}">Preview</button>
          <button type="button" class="af-btn af-btn-red" data-size="${size.id}" data-role="export" disabled>Download</button>
          <span class="af-export-name" data-name="${size.id}"></span>
        </div>`
      })
      .join('')
    this.nodes.names = Array.from(host.querySelectorAll('[data-name]'))
  }

  private async load(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) {
      this.fail('Choose a photograph. That file is not an image.')
      return
    }
    const url = URL.createObjectURL(file)
    try {
      const image = await FeatureImageSession.decode(url)
      this.image = image
      this.root.classList.add('af-has-photo')
      const copy = this.root.querySelector('[data-drop-copy]')
      if (copy)
        copy.textContent = 'Photograph loaded. Drop another to replace it.'
      this.status('Photograph loaded. Nothing was uploaded.')
      this.sync()
      this.render()
    } catch {
      this.fail(
        'That photograph could not be read in this browser. Try a JPEG or PNG.'
      )
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  private render(): void {
    cancelAnimationFrame(this.frame)
    this.frame = requestAnimationFrame(() => this.draw())
  }

  private draw(): void {
    const image = this.image
    const canvas = this.nodes.canvas
    if (!image) return
    const size = FeatureImage.size(this.state.preview)
    const preview = FeatureImage.preview(size)
    if (canvas.width !== preview.width || canvas.height !== preview.height) {
      canvas.width = preview.width
      canvas.height = preview.height
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    const title = this.state.titleOn ? this.state.title : ''
    FeatureImage.paint(ctx, image, image.naturalWidth, image.naturalHeight, {
      preset: FeatureImage.preset(this.state.preset),
      strength: this.state.strength,
      focalX: this.state.focalX,
      focalY: this.state.focalY,
      mark: this.state.mark,
      title
    })
    const preset = FeatureImage.preset(this.state.preset)
    canvas.setAttribute(
      'aria-label',
      `Preview of the ${preset.name} look at ${size.label.toLowerCase()} size`
    )
    this.nodes.caption.textContent = this.caption(size.id)
  }

  private caption(id: FeatureSizeId): string {
    if (id === 'hero') {
      return 'Hero preview uses the same crop as the social card. The file is saved at 2400 × 1260.'
    }
    if (id === 'square') {
      return 'Square crop, 1080 × 1080. Drag the picture, or set the focus sliders. The cross marks the middle.'
    }
    return 'Social card crop, 1200 × 630. Drag the picture to move it. The cross marks the middle. The article hero uses this same shape.'
  }

  private async exportSize(id: FeatureSizeId): Promise<void> {
    const image = this.image
    if (!image) return
    const size = FeatureImage.size(id)
    const canvas = document.createElement('canvas')
    canvas.width = size.width
    canvas.height = size.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    const title = this.state.titleOn ? this.state.title : ''
    FeatureImage.paint(ctx, image, image.naturalWidth, image.naturalHeight, {
      preset: FeatureImage.preset(this.state.preset),
      strength: this.state.strength,
      focalX: this.state.focalX,
      focalY: this.state.focalY,
      mark: this.state.mark,
      title
    })
    const format = this.state.format
    const blob = await FeatureImageSession.blob(
      canvas,
      FeatureImage.mime(format),
      FeatureImage.qualityFor(format)
    )
    if (!blob) {
      this.fail('The browser could not encode that file.')
      return
    }
    const name = FeatureImage.filename(
      this.state.slug,
      this.state.preset,
      id,
      format
    )
    FeatureImageSession.save(blob, name)
    this.status(`Saved ${name}. The file was made in this browser.`)
  }

  private sync(): void {
    const preset = FeatureImage.preset(this.state.preset)
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-preset]')
      .forEach(button => {
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.preset === this.state.preset)
        )
      })
    this.nodes.strength.value = String(Math.round(this.state.strength * 100))
    this.nodes.strengthValue.textContent = `${Math.round(
      this.state.strength * 100
    )}%`
    this.nodes.focalX.value = String(Math.round(this.state.focalX * 100))
    this.nodes.focalY.value = String(Math.round(this.state.focalY * 100))
    this.nodes.focalXValue.textContent = `${Math.round(
      this.state.focalX * 100
    )}%`
    this.nodes.focalYValue.textContent = `${Math.round(
      this.state.focalY * 100
    )}%`
    this.nodes.mark.checked = this.state.mark
    this.nodes.titleOn.checked = this.state.titleOn
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-format]')
      .forEach(button => {
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.format === this.state.format)
        )
      })
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-role="preview"]')
      .forEach(button => {
        const on = button.dataset.size === this.state.preview
        button.setAttribute('aria-pressed', String(on))
        button.textContent = on ? 'Previewing' : 'Preview'
        const card = button.closest('.af-export')
        if (card) card.setAttribute('data-current', String(on))
      })
    const ready = Boolean(this.image)
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-role="export"]')
      .forEach(button => {
        button.disabled = !ready
      })
    for (const node of this.nodes.names) {
      const id = node.dataset.name as FeatureSizeId
      node.textContent = FeatureImage.filename(
        this.state.slug,
        preset.id,
        id,
        this.state.format
      )
    }
  }

  private pointerDown(event: PointerEvent): void {
    if (!this.image || event.button !== 0) return
    const canvas = this.nodes.canvas
    const cover = FeatureImage.cover(
      this.image.naturalWidth,
      this.image.naturalHeight,
      canvas.width,
      canvas.height,
      this.state.focalX,
      this.state.focalY
    )
    canvas.setPointerCapture(event.pointerId)
    this.dragging = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      focalX: this.state.focalX,
      focalY: this.state.focalY,
      coverX: cover.x,
      coverY: cover.y,
      scaledWidth: cover.scaledWidth,
      scaledHeight: cover.scaledHeight
    }
  }

  private pointerMove(event: PointerEvent): void {
    const drag = this.dragging
    if (!drag || event.pointerId !== drag.id) return
    const canvas = this.nodes.canvas
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const dx = ((event.clientX - drag.x) / rect.width) * canvas.width
    const dy = ((event.clientY - drag.y) / rect.height) * canvas.height
    const maxX = Math.max(0, drag.scaledWidth - canvas.width)
    const maxY = Math.max(0, drag.scaledHeight - canvas.height)
    const offsetX = Math.min(maxX, Math.max(0, drag.coverX - dx))
    const offsetY = Math.min(maxY, Math.max(0, drag.coverY - dy))
    this.state.focalX = Math.min(
      1,
      Math.max(0, (offsetX + canvas.width / 2) / drag.scaledWidth)
    )
    this.state.focalY = Math.min(
      1,
      Math.max(0, (offsetY + canvas.height / 2) / drag.scaledHeight)
    )
    this.sync()
    this.render()
  }

  private pointerUp(event: PointerEvent): void {
    if (this.dragging?.id !== event.pointerId) return
    this.dragging = null
  }

  private async detectWebp(): Promise<void> {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const blob = await FeatureImageSession.blob(canvas, 'image/webp', 0.8)
    if (blob?.type === 'image/webp') return
    const webp = this.root.querySelector<HTMLButtonElement>(
      '[data-format="webp"]'
    )
    if (!webp) return
    webp.disabled = true
    webp.title = 'This browser cannot encode WebP.'
  }

  private hasFiles(event: DragEvent): boolean {
    return Array.from(event.dataTransfer?.types ?? []).includes('Files')
  }

  private status(message: string): void {
    this.nodes.status.classList.remove('af-bad')
    this.nodes.status.textContent = message
  }

  private fail(message: string): void {
    this.nodes.status.classList.add('af-bad')
    this.nodes.status.textContent = message
  }

  private static decode(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Could not read the photograph'))
      image.src = url
    })
  }

  private static blob(
    canvas: HTMLCanvasElement,
    type: string,
    quality: number
  ): Promise<Blob | null> {
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), type, quality)
    })
  }

  private static save(blob: Blob, name: string): void {
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = name
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
  }
}

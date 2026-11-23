import {
  computePosition,
  flip,
  offset,
  shift,
  size,
  type VirtualElement
} from '@floating-ui/dom'

/** Viewport rectangle of the glossary term that opened the pop-up. */
export interface AnchorBox {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Places the glossary pop-up with floating-ui so it stays inside the viewport:
 * flip above the term when the space below is shorter, shift it back on screen
 * horizontally, and cap its height to the room that remains.
 */
export class GlossaryPopover {
  private static readonly edge = 8
  private static readonly preferredRem = 24

  static reference(box: AnchorBox): VirtualElement {
    return {
      getBoundingClientRect() {
        return {
          x: box.x,
          y: box.y,
          left: box.x,
          top: box.y,
          right: box.x + box.width,
          bottom: box.y + box.height,
          width: box.width,
          height: box.height
        }
      }
    }
  }

  static place(box: AnchorBox, floating: HTMLElement) {
    const edge = GlossaryPopover.edge
    const preferred =
      GlossaryPopover.preferredRem *
      (Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
        16)
    // Drop a previous cap so flip measures the real content and can move
    // the pop-up to the side that has room.
    floating.style.maxHeight = 'none'
    floating.style.width = `${preferred}px`
    return computePosition(GlossaryPopover.reference(box), floating, {
      strategy: 'fixed',
      placement: 'bottom-start',
      middleware: [
        offset(edge),
        flip({ padding: edge, fallbackStrategy: 'bestFit' }),
        shift({ padding: edge }),
        size({
          padding: edge,
          apply({ availableWidth, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              width: `${Math.max(0, Math.min(availableWidth, preferred))}px`,
              maxHeight: `${Math.max(0, availableHeight)}px`
            })
          }
        })
      ]
    }).then(({ x, y }) => {
      Object.assign(floating.style, {
        left: `${x}px`,
        top: `${y}px`
      })
    })
  }
}

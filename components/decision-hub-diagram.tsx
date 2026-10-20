'use client'

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AIM_SOURCE_COLORS } from '@/lib/aim-colors'

const WIDTH = 1040
const HEIGHT = 800

const A = { fill: AIM_SOURCE_COLORS.appetitesSoft, stroke: AIM_SOURCE_COLORS.appetites }
const I = { fill: AIM_SOURCE_COLORS.intrinsicSoft, stroke: AIM_SOURCE_COLORS.intrinsic }
const M = { fill: AIM_SOURCE_COLORS.mimeticSoft, stroke: AIM_SOURCE_COLORS.mimetic }
const PLAIN = { fill: '#ffffff', stroke: '#6b6660' }
const INK = '#201c19'
const LINE = '#3a3733'

type Tone = { fill: string; stroke: string }

function Box({
  x,
  y,
  w,
  h,
  lines,
  tone,
  boldFirst = true,
  strokeWidth = 1.5
}: {
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  tone: Tone
  boldFirst?: boolean
  strokeWidth?: number
}) {
  const lineHeight = 18
  const start = y + (h - lines.length * lineHeight) / 2 + 13
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={tone.fill}
        stroke={tone.stroke}
        strokeWidth={strokeWidth}
      />
      {lines.map((line, index) => (
        <text
          key={line}
          x={x + w / 2}
          y={start + index * lineHeight}
          textAnchor="middle"
          fill={INK}
          fontSize={index === 0 && boldFirst ? 15 : 13}
          fontWeight={index === 0 && boldFirst ? 650 : 450}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

function ArrowLabel({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  const width = Math.max(...lines.map(line => line.length)) * 6.6 + 16
  const height = lines.length * 15 + 6
  return (
    <g>
      <rect x={x - width / 2} y={y - 12} width={width} height={height} rx={4} fill="#ffffff" />
      {lines.map((line, index) => (
        <text key={line} x={x} y={y + index * 15} textAnchor="middle" fill="#3a3733" fontSize={12} fontWeight={550}>
          {line}
        </text>
      ))}
    </g>
  )
}

function Wire({
  points,
  marker,
  dashed = false,
  head = true
}: {
  points: Array<[number, number]>
  marker: string
  dashed?: boolean
  head?: boolean
}) {
  const d = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0]} ${point[1]}`).join(' ')
  return (
    <path
      d={d}
      fill="none"
      stroke={LINE}
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeDasharray={dashed ? '5 4' : undefined}
      markerEnd={head ? `url(#${marker})` : undefined}
    />
  )
}

function DecisionHubFigure({ markerId }: { markerId: string }) {
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Decision Hub diagram. Body Manager, Thinker, and Observer are aligned across the top and feed one Decision Hub. Every other part connects to those same nodes."
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
        </marker>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="#ffffff" />

      <Box x={56} y={16} w={220} h={68} lines={['Body Manager (A)']} tone={A} strokeWidth={2} />
      <Box x={360} y={16} w={220} h={68} lines={['Thinker (I)']} tone={I} strokeWidth={2} />
      <Box x={664} y={16} w={220} h={68} lines={['Observer (M)']} tone={M} strokeWidth={2} />

      <Box x={56} y={148} w={220} h={58} lines={['Sensory input']} tone={PLAIN} />
      <Box x={360} y={148} w={220} h={58} lines={['Hypothesis Space']} tone={PLAIN} />
      <Box x={664} y={148} w={220} h={58} lines={['Belief Register']} tone={PLAIN} />

      <Box
        x={56}
        y={286}
        w={220}
        h={78}
        lines={['Fast protective reflexes', 'spinal / brainstem / collicular', 'presupposed, not modelled']}
        tone={PLAIN}
      />
      <Box x={360} y={286} w={220} h={56} lines={['Memory Store']} tone={PLAIN} />

      <Box
        x={80}
        y={408}
        w={780}
        h={112}
        lines={[
          'Decision Hub',
          'integrate A, I, M → Scalar V',
          'tag-strip: Source Opacity',
          'holds cached habit store'
        ]}
        tone={{ fill: '#ffffff', stroke: LINE }}
        strokeWidth={2}
      />

      <Box x={80} y={572} w={240} h={56} lines={['Action']} tone={PLAIN} />
      <Box
        x={620}
        y={560}
        w={260}
        h={84}
        lines={['Behaviour without action', 'disengagement, interception']}
        tone={PLAIN}
      />

      <Wire marker={markerId} points={[[276, 50], [308, 50], [308, 392], [220, 392], [220, 408]]} />
      <Wire marker={markerId} points={[[580, 50], [624, 50], [624, 392], [700, 392], [700, 408]]} />
      <Wire marker={markerId} points={[[884, 38], [930, 38], [930, 390], [800, 390], [800, 408]]} />
      <Wire marker={markerId} dashed points={[[470, 408], [352, 408], [352, 50], [360, 50]]} />
      <Wire marker={markerId} points={[[166, 148], [166, 84]]} />
      <Wire marker={markerId} points={[[470, 148], [470, 84]]} />
      <Wire marker={markerId} points={[[470, 286], [470, 206]]} />
      <Wire marker={markerId} points={[[774, 148], [774, 84]]} />
      <Wire marker={markerId} points={[[580, 72], [596, 72], [596, 186], [664, 186]]} />
      <Wire marker={markerId} points={[[276, 178], [332, 178], [332, 100], [430, 100], [430, 84]]} />
      <Wire marker={markerId} points={[[56, 178], [22, 178], [22, 708], [968, 708], [968, 62], [884, 62]]} />
      <Wire marker={markerId} points={[[200, 520], [200, 572]]} />
      <Wire marker={markerId} points={[[760, 520], [760, 560]]} />
      <Wire
        marker={markerId}
        dashed
        points={[
          [200, 628],
          [200, 748],
          [1000, 748],
          [1000, 76],
          [884, 76]
        ]}
      />
      <Wire marker={markerId} dashed head={false} points={[[770, 644], [770, 748]]} />

      <ArrowLabel x={166} y={118} lines={['interoceptive']} />
      <ArrowLabel x={530} y={118} lines={['resolved over']} />
      <ArrowLabel x={560} y={252} lines={['constitutes']} />
      <ArrowLabel x={774} y={108} lines={['conditions Salience', '(top-down, not from', 'the Decision Hub)']} />
      <ArrowLabel x={248} y={230} lines={['deliberative', 'timescale only']} />
      <ArrowLabel x={480} y={688} lines={['perceptual + social (preconscious)']} />
      <ArrowLabel x={520} y={732} lines={['reafference']} />
      <ArrowLabel x={308} y={100} lines={['A: deficit']} />
      <ArrowLabel x={352} y={250} lines={['V (tag-stripped)']} />
      <ArrowLabel x={624} y={128} lines={['I: evaluative']} />
      <ArrowLabel x={622} y={186} lines={['writes']} />
      <ArrowLabel x={960} y={150} lines={['M: Salience', '(preconscious)']} />
      <ArrowLabel x={310} y={548} lines={['selected action']} />
      <ArrowLabel x={880} y={548} lines={['disengagement', 'or interception']} />
    </svg>
  )
}

export function DecisionHubDiagram() {
  const markerId = `hub-arrow-${useId().replace(/:/g, '')}`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [fitScale, setFitScale] = useState(0)

  useLayoutEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
      triggerRef.current?.focus()
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const measure = () => {
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const next = Math.min((rect.width - 32) / WIDTH, (rect.height - 32) / HEIGHT)
      if (next > 0) setFitScale(next)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [open])

  const scale = fitScale * zoom

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setZoom(1)
          setOpen(true)
        }}
        aria-label="Enlarge diagram"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="aim-mermaid aim-mermaid-inline my-4 w-full cursor-zoom-in rounded-lg border bg-white p-4 text-left"
      >
        <DecisionHubFigure markerId={markerId} />
        <span className="mt-3 block text-center text-xs font-medium text-gray-500">Click to enlarge</span>
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col bg-white" role="dialog" aria-modal="true" aria-label="Enlarged diagram">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-600">The whole diagram is fitted to the screen.</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom(current => Math.max(0.5, Number((current - 0.25).toFixed(2))))}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Smaller
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fit
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(current => Math.min(4, Number((current + 0.25).toFixed(2))))}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Larger
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
            <div ref={stageRef} className="min-h-0 flex-1 overflow-auto bg-white p-4">
              <div className="mx-auto" style={{ width: WIDTH * scale, height: HEIGHT * scale }}>
                <div style={{ width: WIDTH, height: HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                  <DecisionHubFigure markerId={`${markerId}-enlarged`} />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

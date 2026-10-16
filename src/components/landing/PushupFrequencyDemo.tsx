'use client'

import { useEffect, useId, useRef } from 'react'
import NextImage from 'next/image'
import { PUSHUP_FREQUENCIES, type PushupFrequency } from '@/lib/installation'

const sprites = {
  green: { size: 280, delays: [170,40,40,40,40,50,40,40,40,40,40,40,50,40,40,250], crop: [0,0,1,1] },
  reps: { size: 320, delays: [540,40,460], crop: [200/1080,140/1080,700/1080,850/1080] },
  onehand: { size: 320, delays: [540,40,420], crop: [180/1080,40/1080,850/1080,920/1080] },
  punch: { size: 320, delays: [40,40,50,40,40,40,40,40,50,40,80,290,40,40,50,40,40,40,40,40,50,40,40,40,40,50,40,40,40,540], crop: [0,0,1,1] },
}
type SpriteName = keyof typeof sprites
const trainingPoses: Record<PushupFrequency['id'], { file: string; label: string }> = {
  daily: { file: 'daily', label: 'Raising one arm into a biceps flex' },
  '8h': { file: '8-hours', label: 'Single-biceps flex' },
  '4h': { file: '4-hours', label: 'Double-biceps flex' },
  '1h': { file: '1-hour', label: 'Forward flex' },
  '15m': { file: '15-minutes', label: 'Sky-pointing victory flex' },
}

function MascotCanvas({ asset, rate = 1, bounce = 0, tilt = false, label }: {
  asset: SpriteName; rate?: number; bounce?: number; tilt?: boolean; label: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const image = new Image()
    let disposed = false, visible = false, frameId = 0, elapsed = 0, last = 0
    const sprite = sprites[asset]
    const duration = sprite.delays.reduce((sum, delay) => sum + delay, 0)
    function draw() {
      if (!image.complete || !image.naturalWidth || !context) return
      const still = reducedMotion.matches
      let time = (still && asset === 'punch' ? 550 : elapsed * rate) % duration
      let frame = 0
      while (frame < sprite.delays.length - 1 && time >= sprite.delays[frame]) time -= sprite.delays[frame++]
      const [x, y, width, height] = sprite.crop
      const drawHeight = asset === 'green' ? 570 : 640
      const drawWidth = drawHeight * width / height
      const phase = elapsed * rate / 1000 * Math.PI
      context.clearRect(0, 0, 640, 640)
      context.save()
      context.translate(320, 320 - (still ? 0 : Math.abs(Math.sin(phase)) * bounce))
      if (tilt && !still) context.rotate(Math.sin(phase) * .025)
      context.drawImage(image, frame * sprite.size + x * sprite.size, y * sprite.size, width * sprite.size, height * sprite.size, -drawWidth/2, -drawHeight/2, drawWidth, drawHeight)
      context.restore()
    }
    function animate(now: number) {
      elapsed += last ? Math.min(now - last, 80) : 0
      last = now
      draw()
      frameId = requestAnimationFrame(animate)
    }
    function update() {
      cancelAnimationFrame(frameId)
      last = 0
      draw()
      if (!disposed && visible && !document.hidden && !reducedMotion.matches && image.complete && image.naturalWidth) frameId = requestAnimationFrame(animate)
    }
    image.onload = update
    image.src = `/mascot/${asset}.webp`
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update() })
    observer.observe(canvas)
    document.addEventListener('visibilitychange', update)
    reducedMotion.addEventListener('change', update)
    return () => {
      disposed = true
      image.onload = null
      cancelAnimationFrame(frameId)
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      reducedMotion.removeEventListener('change', update)
    }
  }, [asset, rate, bounce, tilt])
  return <canvas ref={ref} width={640} height={640} role="img" aria-label={label} />
}

export function BeforeAfterPreview({ frequency }: { frequency: PushupFrequency }) {
  const pose = trainingPoses[frequency.id]
  return <div className="before-after">
    <figure><MascotCanvas asset="green" rate={.7} label="Before: the sad green character" /><figcaption>Before</figcaption></figure>
    <figure>
      <picture key={pose.file}>
        <source media="(prefers-reduced-motion: reduce)" srcSet={`/mascot/training/${pose.file}-still.webp`} />
        <NextImage className="training-pose" src={`/mascot/training/${pose.file}.gif`} alt={`After: ${pose.label}.`} width={1124} height={1399} unoptimized />
      </picture>
      <figcaption>After</figcaption>
    </figure>
  </div>
}

export function PushupFrequencySlider({ frequency, onChange }: { frequency: PushupFrequency; onChange: (frequency: PushupFrequency) => void }) {
  const id = useId()
  const index = PUSHUP_FREQUENCIES.findIndex(item => item.id === frequency.id)
  return <div className="frequency-slider">
    <input id={id} type="range" min={0} max={PUSHUP_FREQUENCIES.length - 1} step={1} value={index} aria-valuetext={frequency.label} onChange={event => onChange(PUSHUP_FREQUENCIES[Number(event.target.value)])} />
    <div className="frequency-ticks">{PUSHUP_FREQUENCIES.map(item => <button type="button" key={item.id} aria-pressed={frequency.id === item.id} onClick={() => onChange(item)}>{item.shortLabel}</button>)}</div>
    <label htmlFor={id} aria-live="polite">{frequency.label}</label>
  </div>
}

export function PushupFrequencyDemo({ frequency, onChange }: { frequency: PushupFrequency; onChange: (frequency: PushupFrequency) => void }) {
  return <div className="frequency-demo">
    <BeforeAfterPreview frequency={frequency} />
    <PushupFrequencySlider frequency={frequency} onChange={onChange} />
  </div>
}

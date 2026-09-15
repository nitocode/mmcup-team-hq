import createGlobe, { type Globe } from 'cobe'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export interface ScreenPoint {
  /** CSS pixels from the left of the canvas. */
  x: number
  /** CSS pixels from the top of the canvas. */
  y: number
  /** Whether cobe draws the marker (front hemisphere or outside the disc). */
  visible: boolean
  /** Normalised depth toward the viewer, in [-1, 1]. */
  depth: number
}

export interface GlobeMarker {
  location: [number, number]
}

interface UseGlobeOptions {
  markers: GlobeMarker[]
  /** Called on every frame with the projected marker positions (same order as `markers`). */
  onFrame?: (points: ScreenPoint[]) => void
}

/** Radius cobe uses for the sphere in clip space. */
const RADIUS = 0.8
const MARKER_ELEVATION = 0.04
const MARKER_SIZE = 0.05
const AUTO_ROTATE_SPEED = 0.0022
const IDLE_DELAY_MS = 2500
/** Keep the tilt reasonable so the globe never looks top-down. */
const MAX_THETA = 1.15
const DRAG_SENSITIVITY = 0.005
const FLY_EASING = 0.075
const DEG = Math.PI / 180

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Normalises an angle delta to [-PI, PI] so rotations take the short way round. */
function shortestAngle(delta: number): number {
  const twoPi = Math.PI * 2
  return ((((delta + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI
}

/**
 * Drives a cobe globe: sizing, drag-to-rotate with inertia, idle auto-rotation,
 * animated fly-to, and per-frame projection of markers to screen space so DOM
 * elements can be overlaid on top of the WebGL canvas.
 */
export function useGlobe(canvasRef: Ref<HTMLCanvasElement | null>, options: UseGlobeOptions) {
  let globe: Globe | null = null
  let raf = 0
  let width = 0
  let height = 0
  let phi = 0
  let theta = 0.3
  let targetPhi: number | null = null
  let targetTheta: number | null = null
  let dragging = false
  let lastX = 0
  let lastY = 0
  let velocity = 0
  let lastInteraction = 0
  let resizeObserver: ResizeObserver | null = null

  /**
   * Mirrors cobe's own marker projection (see its vertex shader): rotate the
   * elevated marker vector by phi (Y axis) then theta (X axis), and map
   * clip-space coordinates to canvas pixels.
   */
  function project([latDeg, lngDeg]: [number, number]): ScreenPoint {
    const lat = latDeg * DEG
    const lng = lngDeg * DEG - Math.PI
    const r = RADIUS + MARKER_ELEVATION
    const cl = Math.cos(lat)
    const x = -cl * Math.cos(lng) * r
    const y = Math.sin(lat) * r
    const z = cl * Math.sin(lng) * r

    const ct = Math.cos(theta)
    const st = Math.sin(theta)
    const cp = Math.cos(phi)
    const sp = Math.sin(phi)

    const sx = cp * x + sp * z
    const sy = sp * st * x + ct * y - cp * st * z
    const sz = -sp * ct * x + st * y + cp * ct * z

    const aspect = width / height
    const fx = (sx / aspect + 1) / 2
    const fy = (-sy + 1) / 2
    const visible = sz >= 0 || sx * sx + sy * sy >= RADIUS * RADIUS

    return { x: fx * width, y: fy * height, visible, depth: sz / r }
  }

  function flyTo([latDeg, lngDeg]: [number, number]) {
    targetPhi = -Math.PI / 2 - lngDeg * DEG
    targetTheta = clamp(latDeg * DEG, -MAX_THETA, MAX_THETA)
    velocity = 0
    lastInteraction = performance.now()
  }

  function frame(now: number) {
    if (!dragging && targetPhi !== null && targetTheta !== null) {
      const dPhi = shortestAngle(targetPhi - phi)
      const dTheta = targetTheta - theta
      phi += dPhi * FLY_EASING
      theta += dTheta * FLY_EASING
      if (Math.abs(dPhi) < 0.0015 && Math.abs(dTheta) < 0.0015) {
        phi = targetPhi
        theta = targetTheta
        targetPhi = null
        targetTheta = null
      }
    } else if (!dragging) {
      if (Math.abs(velocity) > 0.0003) {
        phi += velocity
        velocity *= 0.94
      } else if (now - lastInteraction > IDLE_DELAY_MS) {
        phi += AUTO_ROTATE_SPEED
      }
    }

    globe?.update({ phi, theta })

    if (options.onFrame && width > 0 && height > 0) {
      options.onFrame(options.markers.map((m) => project(m.location)))
    }
    raf = requestAnimationFrame(frame)
  }

  function onPointerDown(e: PointerEvent) {
    const canvas = canvasRef.value
    if (!canvas) return
    dragging = true
    velocity = 0
    targetPhi = null
    targetTheta = null
    lastX = e.clientX
    lastY = e.clientY
    lastInteraction = performance.now()
    canvas.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY
    phi += dx * DRAG_SENSITIVITY
    theta = clamp(theta + dy * DRAG_SENSITIVITY, -MAX_THETA, MAX_THETA)
    velocity = dx * DRAG_SENSITIVITY
    lastInteraction = performance.now()
  }

  function onPointerUp(e: PointerEvent) {
    if (!dragging) return
    dragging = false
    lastInteraction = performance.now()
    canvasRef.value?.releasePointerCapture(e.pointerId)
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const w = Math.round(rect.width)
    const h = Math.round(rect.height)
    if (w === width && h === height) return
    width = w
    height = h
    if (globe && w > 0 && h > 0) globe.update({ width: w, height: h })
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, Math.round(rect.width))
    height = Math.max(1, Math.round(rect.height))

    globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height,
      phi,
      theta,
      dark: 1,
      diffuse: 1.4,
      scale: 1,
      mapSamples: 24000,
      mapBrightness: 7,
      mapBaseBrightness: 0.02,
      baseColor: [0.22, 0.3, 0.55],
      markerColor: [1, 0.72, 0.25],
      glowColor: [0.28, 0.36, 0.72],
      opacity: 0.95,
      markerElevation: MARKER_ELEVATION,
      markers: options.markers.map((m) => ({ location: m.location, size: MARKER_SIZE })),
    })

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    lastInteraction = performance.now() - IDLE_DELAY_MS
    raf = requestAnimationFrame(frame)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    resizeObserver?.disconnect()
    const canvas = canvasRef.value
    if (canvas) {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
    globe?.destroy()
    globe = null
  })

  return { flyTo }
}

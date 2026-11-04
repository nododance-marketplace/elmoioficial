import { motion } from 'framer-motion'
import { memo } from 'react'

export type FlowerState =
  | 'fresh'
  | 'received'
  | 'wilted'
  | 'crushed'
  | 'pocket'
  | 'burning'
  | 'givenAway'

type Config = {
  tilt: number
  scale: number
  color: string
  petalOpacity: number
  droop: number
  scatter: number[]
  fall: boolean
  flame: boolean
  stemBend: string
}

const CONFIGS: Record<FlowerState, Config> = {
  fresh: {
    tilt: 0,
    scale: 1,
    color: '#c1272d',
    petalOpacity: 1,
    droop: 0,
    scatter: [0, 0, 0, 0, 0, 0, 0, 0],
    fall: false,
    flame: false,
    stemBend: 'M100 140 C 100 190, 96 220, 88 250',
  },
  received: {
    tilt: -7,
    scale: 0.97,
    color: '#d0383d',
    petalOpacity: 1,
    droop: 0,
    scatter: [0, 0, 0, 0, 0, 0, 0, 0],
    fall: false,
    flame: false,
    stemBend: 'M100 140 C 100 190, 98 220, 92 250',
  },
  wilted: {
    tilt: 14,
    scale: 0.84,
    color: '#94535c',
    petalOpacity: 0.88,
    droop: 34,
    scatter: [6, 10, 8, 12, 6, 10, 8, 12],
    fall: false,
    flame: false,
    stemBend: 'M100 140 C 106 190, 112 222, 120 250',
  },
  crushed: {
    tilt: 4,
    scale: 0.78,
    color: '#7e2830',
    petalOpacity: 0.62,
    droop: 46,
    scatter: [38, -30, 22, -44, 30, -26, -40, 34],
    fall: false,
    flame: false,
    stemBend: 'M100 140 C 96 190, 88 222, 70 250',
  },
  pocket: {
    tilt: 0,
    scale: 0.52,
    color: '#b98a8f',
    petalOpacity: 0.16,
    droop: 0,
    scatter: [0, 0, 0, 0, 0, 0, 0, 0],
    fall: false,
    flame: false,
    stemBend: 'M100 140 C 100 190, 100 224, 100 250',
  },
  burning: {
    tilt: -5,
    scale: 0.9,
    color: '#5a1613',
    petalOpacity: 0.9,
    droop: 20,
    scatter: [10, 12, 8, 14, 10, 12, 8, 14],
    fall: false,
    flame: true,
    stemBend: 'M100 140 C 98 190, 94 224, 90 250',
  },
  givenAway: {
    tilt: 0,
    scale: 1,
    color: '#c1272d',
    petalOpacity: 1,
    droop: 0,
    scatter: [0, 0, 0, 0, 0, 0, 0, 0],
    fall: true,
    flame: false,
    stemBend: 'M100 140 C 100 190, 96 224, 90 250',
  },
}

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

const SPRING = { type: 'spring' as const, stiffness: 90, damping: 18 }

function petalPath(c: Config) {
  const cy = 118 + c.droop * 0.35
  return `M100 ${cy} C ${92 - c.droop * 0.1} ${cy - 12}, ${88 - c.droop * 0.1} ${cy - 34}, ${
    100 + c.droop * 0.22
  } ${cy - 44 + c.droop * 0.9} C ${112 + c.droop * 0.1} ${cy - 34}, ${
    108 + c.droop * 0.1
  } ${cy - 12}, 100 ${cy}`
}

export const RedFlower = memo(function RedFlower({
  state,
  className = '',
}: {
  state: FlowerState
  className?: string
}) {
  const c = CONFIGS[state]
  return (
    <svg
      viewBox="0 0 200 270"
      className={className}
      role="img"
      aria-label={`Red flower, ${state}`}
    >
      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="80%" r="65%">
          <stop offset="0%" stopColor="#f6c14b" />
          <stop offset="55%" stopColor="#d0383d" />
          <stop offset="100%" stopColor="#c1272d" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.path
        initial={false}
        animate={{ d: c.stemBend }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
        stroke="#4d7a4a"
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
      />
      <motion.path
        initial={false}
        animate={{ opacity: state === 'pocket' ? 0.35 : 0.9 }}
        d="M96 210 C 84 206, 74 210, 66 218 C 78 222, 90 220, 96 214 Z"
        fill="#4d7a4a"
      />

      <motion.g
        initial={false}
        animate={{
          rotate: c.tilt,
          scale: c.scale,
          y: state === 'crushed' ? 30 : 0,
        }}
        transition={SPRING}
        style={{ originX: '100px', originY: '140px' }}
      >
        {c.fall ? (
          <FallingPetals color={c.color} />
        ) : (
          ANGLES.map((a, i) => (
            <motion.g
              key={a}
              initial={false}
              animate={{ rotate: a + c.scatter[i] }}
              transition={SPRING}
              style={{ originX: '100px', originY: `${118 + c.droop * 0.35}px` }}
            >
              <motion.path
                initial={false}
                animate={{ d: petalPath(c), fill: c.color, opacity: c.petalOpacity }}
                transition={{ default: SPRING }}
                fill={c.color}
                stroke={state === 'burning' ? '#2a0b16' : 'none'}
                strokeWidth={state === 'burning' ? 1.5 : 0}
              />
            </motion.g>
          ))
        )}
        <motion.circle
          initial={false}
          animate={{
            fill: state === 'burning' ? '#3a101f' : '#c6a15b',
            opacity: state === 'pocket' ? 0.3 : 1,
          }}
          transition={SPRING}
          cx="100"
          cy={118 + c.droop * 0.35}
          r="10"
        />
      </motion.g>

      {c.flame && (
        <g className="animate-flicker">
          <path
            d="M100 36 C 108 56, 122 70, 116 88 C 112 102, 88 102, 84 88 C 80 74, 92 60, 100 36 Z"
            fill="url(#flameGrad)"
            opacity="0.95"
          />
        </g>
      )}
    </svg>
  )
})

const FallingPetals = ({ color }: { color: string }) => (
  <>
    {ANGLES.map((a, i) => (
      <motion.path
        key={a}
        d="M100 96 C 96 112, 96 128, 100 134 C 104 128, 104 112, 100 96 Z"
        fill={color}
        initial={{ rotate: a, opacity: 1 }}
        animate={{
          y: [0, 40 + i * 14, 100 + i * 12],
          x: [(i % 2 === 0 ? -1 : 1) * (8 + i * 5)],
          rotate: [a, a + 40 * (i % 2 ? 1 : -1), a + 110 * (i % 2 ? 1 : -1)],
          opacity: [1, 0.85, 0],
        }}
        transition={{
          duration: 3.2 + i * 0.35,
          repeat: Infinity,
          repeatDelay: 1.4,
          ease: 'easeIn',
        }}
        style={{ originX: '100px', originY: '115px' }}
      />
    ))}
  </>
)

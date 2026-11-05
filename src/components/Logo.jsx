import { LOGO_PATHS, LOGO_VIEWBOX } from '../logo.js'

// โลโก้แบบเวกเตอร์ (สีตาม currentColor) — variant="outline" วาดเป็นเส้น
export default function Logo({ className = '', variant = 'fill', title }) {
  return (
    <svg className={`logo ${className}`} viewBox={LOGO_VIEWBOX} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} pathLength="1" fill={variant === 'outline' ? 'none' : 'currentColor'} stroke={variant === 'outline' ? 'currentColor' : 'none'} />
      ))}
    </svg>
  )
}

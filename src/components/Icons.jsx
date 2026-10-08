const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
)
export const HeartIcon = ({ filled, ...p }) => (
  <svg {...base} {...p}>
    <path
      d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"
      fill={filled ? 'currentColor' : 'none'}
    />
  </svg>
)
export const BagIcon = (p) => (
  <svg {...base} {...p}><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
)
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const MenuIcon = (p) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const ChevronIcon = (p) => (
  <svg {...base} {...p}><path d="M7 10l5 5 5-5" /></svg>
)
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const MinusIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
)
export const ArrowIcon = ({ dir = 'right', ...p }) => (
  <svg {...base} {...p} style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)
export const TruckIcon = (p) => (
  <svg {...base} {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></svg>
)
export const ShieldIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
)
export const PenIcon = (p) => (
  <svg {...base} {...p}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" /><path d="M14 7l3 3" /></svg>
)
export const ChatIcon = (p) => (
  <svg {...base} {...p}><path d="M4 19l1.4-3.6A7.5 7.5 0 1 1 8.6 18.6L4 19z" /></svg>
)

export const HEIGHT_PER_HOUR = 56
export const MARGIN_EVENTS = 2

// can be used to map a proprity to a color as well (using `priority - 1` as index)
// reorder this to change the assignment of colors to priorities
export const ACCENT_COLOR_VARIANTS = ['blue', 'pink', 'green', 'purple', 'orange', 'sky', 'fuchsia'] as const

export type AccentColorVariant = (typeof ACCENT_COLOR_VARIANTS)[number]

export type AccentColorBasedStyle = Record<AccentColorVariant, string>

export const COLORS_PER_PRIORITY: AccentColorBasedStyle = {
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  sky: 'bg-sky-100 text-sky-700 hover:bg-sky-200',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200'
}

'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { BadgeCheckIcon, XIcon } from 'lucide-react'
import { clsx } from 'clsx'
import type { AccentColorBasedStyle, AccentColorVariant } from '@/utils/constants'

const MODAL_STYLE_PER_ACCENT_COLOR_VARIANT = {
  blue: 'outline-blue-200',
  pink: 'outline-pink-300',
  green: 'outline-green-300',
  purple: 'outline-purple-300',
  orange: 'outline-orange-300',
  sky: 'outline-sky-300',
  fuchsia: 'outline-fuchsia-300'
} as const satisfies AccentColorBasedStyle

const CLOSE_BTN_STYLE_PER_ACCENT_COLOR_VARIANT = {
  blue: 'text-blue-600 hover:bg-blue-100 focus:bg-blue-100',
  pink: 'text-pink-600 hover:bg-pink-100 focus:bg-pink-100',
  green: 'text-green-600 hover:bg-green-100 focus:bg-green-100',
  purple: 'text-purple-600 hover:bg-purple-100 focus:bg-purple-100',
  orange: 'text-orange-600 hover:bg-orange-100 focus:bg-orange-100',
  sky: 'text-sky-600 hover:bg-sky-100 focus:bg-sky-100',
  fuchsia: 'text-fuchsia-600 hover:bg-fuchsia-100 focus:bg-fuchsia-100'
} as const satisfies AccentColorBasedStyle

type ModalProps = PropsWithChildren<{
  title: string
  verified?: boolean
  accentColorVariant?: AccentColorVariant
  trigger: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}>

export const Modal = ({
  title,
  verified = false,
  accentColorVariant = 'pink',
  trigger,
  children,
  open,
  onOpenChange
}: ModalProps) => {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={clsx(
            'z-20 mb-3 flex max-h-[400px] w-[352px] flex-col overflow-y-scroll rounded-lg bg-white shadow-lg outline outline-[3px]',
            MODAL_STYLE_PER_ACCENT_COLOR_VARIANT[accentColorVariant]
          )}
          side="left"
          align="start"
          sideOffset={10}
          alignOffset={-12}
        >
          <div className="flex-1 rounded-xl bg-white p-4">
            <div className="mx-auto max-w-md">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <h2 className="mb-4 font-medium">{title}</h2>
                  {verified && <BadgeCheckIcon className="ml-1 mt-0.5 size-5 shrink-0 stroke-[2.5px]" />}
                </div>
                <Popover.Close
                  className={clsx(
                    '-mr-1 -mt-1 rounded-full p-1 focus:outline-none',
                    CLOSE_BTN_STYLE_PER_ACCENT_COLOR_VARIANT[accentColorVariant]
                  )}
                  aria-label="Close"
                >
                  <XIcon className="size-6" />
                </Popover.Close>
              </div>
              {children}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

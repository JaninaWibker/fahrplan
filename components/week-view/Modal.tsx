'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import * as Popover from '@radix-ui/react-popover'

type ModalProps = PropsWithChildren<{
  title: string
  trigger: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}>

export const Modal = ({ title, trigger, children, open, onOpenChange }: ModalProps) => {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-20 mb-3 flex max-h-[400px] w-[352px] flex-col overflow-y-scroll rounded-lg bg-white shadow-lg outline outline-[3px] outline-pink-300"
          side="left"
          align="start"
          sideOffset={10}
          alignOffset={-12}
        >
          <div className="flex-1 rounded-xl bg-white p-4">
            <div className="mx-auto max-w-md">
              <h2 className="mb-4 font-medium">{title}</h2>
              {children}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

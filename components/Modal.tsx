'use client'

import { useState } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import { Drawer } from 'vaul'
import { clsx } from 'clsx'

type ModalProps = PropsWithChildren<{
  title: string
  trigger: ReactNode
}>

export const Modal = ({ title, trigger, children }: ModalProps) => {
  const [snap, setSnap] = useState<string | number | null>('196px')

  return (
    <Drawer.Root
      shouldScaleBackground
      snapPoints={['196px', 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      fadeFromIndex={0}
    >
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 mt-24 flex h-full max-h-[97vh] flex-col rounded-t-[10px] bg-gray-100 focus:outline-none">
          <div className="flex-1 rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-4 font-medium">{title}</Drawer.Title>
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

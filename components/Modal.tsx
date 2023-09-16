'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import CloseIcon from '../icons/Close'

type ModalProps = PropsWithChildren<{
  title: string
  trigger: ReactNode
}>

export const Modal = ({ title, trigger, children }: ModalProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal className="fixed right-0 top-0 h-screen w-screen">
        <Dialog.Overlay>
          <div className="fixed left-0 top-0 h-screen w-screen bg-black/25" />
        </Dialog.Overlay>
        <Dialog.Content>
          <div className="absolute bottom-0 flex h-fit w-full flex-col gap-2 overflow-hidden rounded bg-white pb-32">
            <div className="w-full">
              <Dialog.Title className="p-2 font-bold">{title}</Dialog.Title>
              <div className="overflow-scroll">{children}</div>
              <Dialog.Close className="absolute right-0 top-0 p-2">
                <CloseIcon />
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


import type { PropsWithChildren, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import CloseIcon from '../icons/Close'

type ModalProps = PropsWithChildren<{
  title: string,
  trigger: ReactNode
}>

const Modal = ({ title, trigger, children }: ModalProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal className="fixed w-screen h-screen top-0 right-0">
      <Dialog.Overlay>
        <div className="bg-black bg-opacity-25 fixed top-0 left-0 w-screen h-screen" />
      </Dialog.Overlay>
      <Dialog.Content>
        <div className="absolute flex flex-col gap-2 bottom-0 w-full h-fit pb-32 rounded bg-white overflow-hidden">
          <div className="w-full">
            <Dialog.Title className="font-bold p-2">{title}</Dialog.Title>
            <div className="overflow-scroll">{children}</div>
            <Dialog.Close className="absolute top-0 right-0 p-2">
              <CloseIcon />
            </Dialog.Close>
          </div>
        </div>
      </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal

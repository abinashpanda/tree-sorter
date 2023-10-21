import { createPortal } from 'react-dom'

type PortalProps = {
  children: React.ReactNode
  container?: HTMLElement
}

export default function Portal({ children, container = document.body }: PortalProps) {
  return createPortal(children, container)
}

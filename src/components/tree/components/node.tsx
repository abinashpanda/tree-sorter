import { cn } from '@/lib/utils'
import { TreeItem } from '../types'
import { forwardRef } from 'react'

type NodeItemProps = React.ComponentPropsWithoutRef<'button'> & {
  item: TreeItem
}

const NodeItem = forwardRef<React.ElementRef<'button'>, NodeItemProps>(({ item, className, ...rest }, ref) => {
  return (
    <button
      {...rest}
      ref={ref}
      className={cn(
        'flex items-center space-x-2 truncate rounded-md px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1',
        className,
      )}
    >
      <div className="h-4 w-4 flex-shrink-0 rounded-sm border border-dashed border-muted-foreground" />
      <span className="truncate">{item.label}</span>
    </button>
  )
})

NodeItem.displayName = 'NodeItem'

export default NodeItem

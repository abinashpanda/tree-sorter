import { FlattenTreeItem } from '@/lib/tree'
import NodeItem from './node'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

type TreeNodeProps = {
  item: FlattenTreeItem
  className?: string
  style?: React.CSSProperties
}

export default function TreeNode({ item, className, style = {} }: TreeNodeProps) {
  const { setDraggableNodeRef, setDroppableNodeRef, listeners, attributes, isDragging, transform, transition } =
    useSortable({
      id: item.id,
      data: {
        type: 'tree-node',
        item: item,
      },
      // TODO: Move it to the tree component prop
      disabled: item.id === 'root',
    })

  return (
    <div
      className="pl-[var(--spacing)]"
      style={
        {
          '--spacing': `${item.depth * 1.5}rem`,
          transition,
          transform: CSS.Transform.toString(transform),
          ...style,
        } as React.CSSProperties
      }
      ref={setDroppableNodeRef}
    >
      <NodeItem
        item={item}
        {...listeners}
        {...attributes}
        suppressHydrationWarning
        ref={setDraggableNodeRef}
        style={{ opacity: isDragging ? 0.25 : 1 }}
        className={cn(
          'w-full',
          isDragging
            ? 'relative rounded-none py-0 before:absolute before:bottom-0 before:left-2 before:right-0 before:h-0.5 before:bg-foreground [&_*]:!h-0 [&_*]:!opacity-0'
            : undefined,
          className,
        )}
      />
    </div>
  )
}

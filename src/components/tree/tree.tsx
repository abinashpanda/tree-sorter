import { cn } from '@/lib/utils'
import { TreeItem } from './types'
import { Suspense, useMemo, useState } from 'react'
import flattenTree, { FlattenTreeItem, buildTree, getProjection } from '@/lib/tree'
import { DndContext, UniqueIdentifier, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TreeNode from './components/tree-node'
import dynamic from 'next/dynamic'
import NodeOverlay from './components/node-overlay'

const Portal = dynamic(() => import('../portal'), { ssr: false })

type TreeProps = {
  tree: TreeItem[]
  onChange: (tree: TreeItem[]) => void
  className?: string
  style?: React.CSSProperties
}

export default function Tree({ tree: _tree, className, style }: TreeProps) {
  const [tree, setTree] = useState<TreeItem[]>(_tree)

  const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>()
  const [overId, setOverId] = useState<UniqueIdentifier | undefined>()
  const [offsetLeft, setOffsetLeft] = useState(0)

  const flattenedTree = useMemo(() => flattenTree(tree), [tree])

  const projection = useMemo(
    () => (activeId && overId ? getProjection(flattenedTree, activeId, overId, offsetLeft, 24) : null),
    [flattenedTree, activeId, overId, offsetLeft],
  )

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragMove={({ delta }) => {
        setOffsetLeft(delta.x)
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id)
        setOverId(active.id)
      }}
      onDragOver={({ over }) => {
        setOverId(over?.id)
      }}
      onDragEnd={({ active, over }) => {
        setActiveId(undefined)
        setOverId(undefined)
        setOffsetLeft(0)

        if (active && over && active.id !== over.id) {
          const activeIndex = flattenedTree.findIndex((item) => item.id === active.id)
          const overIndex = flattenedTree.findIndex((item) => item.id === over.id)
          const clonedItems: FlattenTreeItem[] = JSON.parse(JSON.stringify(flattenedTree))
          clonedItems[activeIndex] = {
            ...clonedItems[activeIndex],
            depth: projection?.depth ?? clonedItems[activeIndex].depth,
            parentId: projection?.parentId ?? clonedItems[activeIndex].parentId,
          }
          const newTree = arrayMove(clonedItems, activeIndex, overIndex)
          setTree(buildTree(newTree))
        }
      }}
    >
      <SortableContext items={flattenedTree.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className={cn('truncate', className)} style={style}>
          {flattenedTree.map((item) => {
            return (
              <TreeNode
                key={item.id}
                item={item.id === activeId ? { ...item, depth: projection?.depth ?? item.depth } : item}
                className={item.id === projection?.parentId ? 'bg-muted' : undefined}
              />
            )
          })}
        </div>
      </SortableContext>
      <Portal>
        <NodeOverlay />
      </Portal>
    </DndContext>
  )
}

import { TreeItem } from '@/components/tree/types'
import { UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import z from 'zod'

export type FlattenTreeItem = TreeItem & {
  index: number
  depth: number
  parentId?: string
}

export default function flattenTree(tree: TreeItem[]): FlattenTreeItem[] {
  function flattenItem(item: TreeItem, index: number, depth: number, parentId?: string): FlattenTreeItem[] {
    return [
      {
        ...item,
        index,
        depth,
        parentId,
      },
      ...item.children.flatMap((child, childIndex) => flattenItem(child, childIndex, depth + 1, item.id)),
    ]
  }

  return flattenItem(tree[0], 0, 0)
}

export const treeItemSchema: z.ZodType<TreeItem> = z.object({
  id: z.string(),
  label: z.string(),
  children: z.array(z.lazy(() => treeItemSchema)),
})

export function getProjection(
  items: FlattenTreeItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth(previousItem)
  const minDepth = getMinDepth(nextItem)
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId

    return newParent ?? null
  }
}

function getMaxDepth(previousItem: FlattenTreeItem) {
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

function getMinDepth(nextItem: FlattenTreeItem) {
  if (nextItem) {
    return nextItem.depth
  }

  return 0
}

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

export function buildTree(flattenedItems: FlattenTreeItem[]): TreeItem[] {
  const root: TreeItem = { id: 'root', label: 'Container 0', children: [] }
  const nodes: Record<string, TreeItem> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, children: [] }))

  for (const item of items) {
    const { id, children } = item
    const parentId = item.parentId ?? root.id
    const parent = nodes[parentId] ?? findItem(items, parentId)
    nodes[id] = { id, children, label: item.label }
    parent.children.push(item)
  }

  return root.children
}

export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId)
}

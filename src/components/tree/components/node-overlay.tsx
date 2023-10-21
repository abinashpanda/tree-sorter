import { treeItemSchema } from '@/lib/tree'
import { DragOverlay, DropAnimation, Modifier, defaultDropAnimation, useDndContext } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useMemo } from 'react'
import z from 'zod'
import { TreeItem } from '../types'
import NodeItem from './node'

const activeNodeDataSchema = z.object({
  type: z.literal('tree-node'),
  item: treeItemSchema,
})

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ]
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    })
  },
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    // TODO: Figure out the reason why we need to subtract 10 from the y value
    y: transform.y - 10,
  }
}

export default function NodeOverlay() {
  const { active } = useDndContext()
  const activeNodeData = useMemo(() => {
    const result = activeNodeDataSchema.safeParse(active?.data?.current)
    if (result.success) {
      return result.data.item
    }
    return null
  }, [active])

  if (!activeNodeData) {
    return null
  }

  return (
    <DragOverlay dropAnimation={dropAnimationConfig} modifiers={[adjustTranslate]}>
      <NodeItem item={activeNodeData} className="border bg-muted" />
    </DragOverlay>
  )
}

'use client'

import Tree from '@/components/tree'
import { TreeItem } from '@/components/tree/types'
import { useState } from 'react'

const DEFAULT_ITEMS: TreeItem[] = [
  {
    id: 'root',
    label: 'Container 0',
    children: [
      {
        id: 'root.1.1',
        label: 'Container 1',
        children: [
          {
            id: 'root.1.1.1',
            label: 'Container 2',
            children: [
              {
                id: 'root.1.1.1.1',
                label: 'Container 3',
                children: [
                  {
                    id: 'root.1.1.1.1.1',
                    label: 'Container 4',
                    children: [],
                  },
                ],
              },
              {
                id: 'root.1.1.1.2',
                label: 'Container 5',
                children: [],
              },
              {
                id: 'root.1.1.1.3',
                label: 'Container 6',
                children: [
                  {
                    id: 'root.1.1.1.3.1',
                    label: 'Container 7',
                    children: [],
                  },
                  {
                    id: 'root.1.1.1.3.2',
                    label: 'Container 8',
                    children: [],
                  },
                  {
                    id: 'root.1.1.1.3.3',
                    label: 'Container 9',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'root.1.2',
        label: 'Container 10',
        children: [],
      },
    ],
  },
]

export default function Page() {
  const [tree, setTree] = useState<TreeItem[]>(DEFAULT_ITEMS)

  return (
    <div className="h-screen p-8">
      <Tree tree={tree} onChange={setTree} className="w-[240px] rounded-md border p-2" />
    </div>
  )
}

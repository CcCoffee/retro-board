import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import ActionItemInput from '@/components/ActionItemInput'
import ActionItemList from '@/components/ActionItemList'
import { ActionItem } from "@/types/retro"

interface ActionItemSidebarProps {
  actionItems: ActionItem[]
  onActionItemSubmit: (actionItem: Omit<ActionItem, 'id' | 'createdAt'>) => void
  onActionItemDelete: (itemId: number) => void
  onActionItemEdit: (item: ActionItem) => void
  editingActionItem: ActionItem | null
}

const ActionItemSidebar: React.FC<ActionItemSidebarProps> = ({
  actionItems,
  onActionItemSubmit,
  onActionItemDelete,
  onActionItemEdit,
  editingActionItem
}) => {
  const totalActionItems = actionItems.length
  const overdueTasks = actionItems.filter(item => !!item.dueDate).filter(item => new Date(item.dueDate) < new Date()).length

  return (
    <ScrollArea className="w-[300px] pr-4">
      <h3 className="text-lg font-bold mb-2 font-heading">Action Items</h3>
      <ActionItemInput 
        onSubmit={onActionItemSubmit}
        editingActionItem={editingActionItem}
      />
      <div className="flex justify-between items-center my-2 text-sm">
        <span className="flex items-center">
          Total: <Badge variant="secondary" className="ml-1">{totalActionItems}</Badge>
        </span>
        <span className="flex items-center">
          Overdue: <Badge variant="destructive" className="ml-1">{overdueTasks}</Badge>
        </span>
      </div>
      <ActionItemList 
        actionItems={actionItems}
        onDelete={onActionItemDelete}
        onEdit={onActionItemEdit}
      />
    </ScrollArea>
  )
}

export default ActionItemSidebar
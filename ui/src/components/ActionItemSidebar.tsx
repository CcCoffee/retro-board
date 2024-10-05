import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import ActionItemInput from '@/components/ActionItemInput'
import ActionItemList from '@/components/ActionItemList'
import { ActionItem, User } from "@/types/retro"

interface ActionItemSidebarProps {
  actionItems: ActionItem[]
  users: User[]
  onActionItemSubmit: (actionItem: Omit<ActionItem, 'id' | 'createdAt'>) => void
  onActionItemDelete: (itemId: number) => void
  onActionItemEdit: (item: ActionItem) => void
  editingActionItem: ActionItem | null
}

const ActionItemSidebar: React.FC<ActionItemSidebarProps> = ({
  actionItems,
  users,
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
        users={users}
        onSubmit={onActionItemSubmit}
        editingActionItem={editingActionItem}
      />
      <div className="flex justify-between items-center mt-2 text-sm">
        <span>Total: <Badge variant="secondary">{totalActionItems}</Badge></span>
        <span>Overdue: <Badge variant="destructive">{overdueTasks}</Badge></span>
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
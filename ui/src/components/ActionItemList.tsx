import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon } from "lucide-react"
import { ActionItem } from "@/types/retro"

interface ActionItemListProps {
  actionItems: ActionItem[]
  onDelete: (itemId: number) => void
  onEdit: (item: ActionItem) => void
}

const ActionItemList: React.FC<ActionItemListProps> = ({ actionItems, onDelete, onEdit }) => {
  return (
    <div>
      {actionItems.map((item) => (
        <Card 
          key={item.id} 
          className={`mb-2 ${
            new Date(item.dueDate) < new Date() 
              ? "bg-destructive/10" 
              : "bg-yellow-100"
          }`}
        >
          <CardContent className="px-4 pt-2 pb-0">
            <p className="whitespace-pre-wrap break-words">{item.content}</p>
          </CardContent>
          <div className="h-[40px] flex justify-between items-center pl-4 pr-2">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="text-xs text-muted-foreground truncate">
                {item.assignee.name}
              </span>
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-xs text-muted-foreground truncate">
                {item.dueDate ? item.dueDate : 'No due date'}
              </span>
            </div>
            <div className="flex">
              <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(item.id!)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ActionItemList
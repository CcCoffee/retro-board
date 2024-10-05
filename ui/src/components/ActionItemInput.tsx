import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { format, setHours, setMinutes, setSeconds, setMilliseconds, startOfDay } from "date-fns"
import { ActionItem, User } from "@/types/retro"

interface ActionItemInputProps {
  users: User[]
  onSubmit: (actionItem: Omit<ActionItem, 'id' | 'createdAt'>) => void
  editingActionItem: ActionItem | null
}

const ActionItemInput: React.FC<ActionItemInputProps> = ({ users, onSubmit, editingActionItem }) => {
  const [newActionItem, setNewActionItem] = useState<Omit<ActionItem, 'id' | 'createdAt'>>({
    assignee: { id: "", name: "", avatar: "", email: "" },
    dueDate: "",
    content: ""
  })
  const [openAssignee, setOpenAssignee] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  useEffect(() => {
    if (editingActionItem) {
      setNewActionItem({
        assignee: editingActionItem.assignee,
        dueDate: editingActionItem.dueDate,
        content: editingActionItem.content
      })
    }
  }, [editingActionItem])

  const getLocalEndOfDay = (date: Date) => {
    return setMilliseconds(setSeconds(setMinutes(setHours(date, 23), 59), 59), 999);
  }

  const handleSubmit = () => {
    onSubmit(newActionItem)
    setNewActionItem({
      assignee: { id: "", name: "", avatar: "", email: "" },
      dueDate: "",
      content: ""
    })
  }

  const handleActionItemKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter 用于换行，不需要特殊处理
        return;
      } else {
        // 仅 Enter 键用于提交
        e.preventDefault(); // 阻止默认的换行行为
        if (isActionItemValid) {
          handleSubmit();
        }
      }
    }
  }

  const isActionItemValid = newActionItem.assignee.id && newActionItem.content.trim() !== ""

  return (
    <div className="mb-2 px-1">
      <Label htmlFor="assignee">Assignee</Label>
      <Popover open={openAssignee} onOpenChange={setOpenAssignee}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openAssignee}
            className="w-full justify-between"
          >
            {newActionItem.assignee.id
              ? `${newActionItem.assignee.name} (${newActionItem.assignee.id})`
              : "Select assignee..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search assignee..." />
            <CommandList>
              <CommandEmpty>No assignee found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={`${user.name} ${user.id}`.toLowerCase()}
                    onSelect={() => {
                      setNewActionItem({ ...newActionItem, assignee: user })
                      setOpenAssignee(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        newActionItem.assignee.id === user.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {user.name} ({user.id})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Label htmlFor="dueDate" className="mt-2">Due Date</Label>
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button id="dueDate" variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {newActionItem.dueDate ? format(new Date(newActionItem.dueDate), 'yyyy-MM-dd HH:mm') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={newActionItem.dueDate ? new Date(newActionItem.dueDate) : undefined}
            onSelect={(date: Date | undefined) => {
              if (date) {
                const localEndOfDay = getLocalEndOfDay(date);
                setNewActionItem({ ...newActionItem, dueDate: localEndOfDay.toISOString() });
              } else {
                setNewActionItem({ ...newActionItem, dueDate: '' });
              }
              setIsDatePickerOpen(false);
            }}
            disabled={(date) => date < startOfDay(new Date())}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Label htmlFor="actionContent" className="mt-2">Action Item</Label>
      <Textarea
        id="actionContent"
        placeholder="Action item content (Enter to submit, Shift + Enter for new line)"
        value={newActionItem.content}
        onChange={(e) => setNewActionItem({ ...newActionItem, content: e.target.value })}
        onKeyDown={handleActionItemKeyPress}
        className="mt-2"
      />
      <Button 
        className="w-full mt-2" 
        onClick={handleSubmit} 
        disabled={!isActionItemValid}
      >
        {editingActionItem ? "Update" : "Add"} Action Item
      </Button>
    </div>
  )
}

export default ActionItemInput
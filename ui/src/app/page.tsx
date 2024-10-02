"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, PencilIcon, TrashIcon } from "lucide-react"
import { format, isBefore, startOfDay } from "date-fns"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { authService } from "@/services/authService"
import { retroService } from "@/services/retroService"
import { User, RetroCard, ActionItem } from "@/types/retro"
import { showToast } from "@/utils/toast"

const typesInfo = [
  { id: "good", title: "Good", color: "bg-green-100", indicatorColor: "bg-green-300" },
  { id: "keep", title: "Keep", color: "bg-blue-100", indicatorColor: "bg-blue-300" },
  { id: "change", title: "Change", color: "bg-yellow-100", indicatorColor: "bg-yellow-300" },
  { id: "bad", title: "Bad", color: "bg-red-100", indicatorColor: "bg-red-300" },
]

const users: User[] = [
  { id: "E001", name: "E001", avatar: "/E001.svg?height=32&width=32", email: "E001@example.com" },
  { id: "E002", name: "E002", avatar: "/E002.svg?height=32&width=32", email: "E002@example.com" },
  { id: "E003", name: "E003", avatar: "/E003.svg?height=32&width=32", email: "E003@example.com" },
  { id: "E004", name: "E004", avatar: "/E004.svg?height=32&width=32", email: "E004@example.com" },
  { id: "E005", name: "E005", avatar: "/E005.svg?height=32&width=32", email: "E005@example.com" },
]

export default function RetroBoard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cards, setCards] = useState<RetroCard[]>([])
  const [newCard, setNewCard] = useState<Omit<RetroCard, 'id' | 'author' | 'likes'>>({
    type: "good",
    content: "",
    isAnonymous: false,
    createdAt: new Date().toISOString(),
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [newActionItem, setNewActionItem] = useState<Omit<ActionItem, 'id'>>({ assignee: "", dueDate: "", content: "" })
  const [editingActionItem, setEditingActionItem] = useState<ActionItem | null>(null)
  const [openAssignee, setOpenAssignee] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkLoginStatus = () => {
      const isUserLoggedIn = !!localStorage.getItem("user")
      setIsLoggedIn(isUserLoggedIn)
      if (isUserLoggedIn) {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          loadData()
        }
      } else {
        router.push("/login") // 如果未登录,重定向到登录页面
      }
      setIsLoading(false)
    }

    checkLoginStatus()
  }, [router])

  const loadData = async () => {
    try {
      const loadedCards = await retroService.getCards()
      setCards(loadedCards)

      const loadedActionItems = await retroService.getActionItems()
      setActionItems(loadedActionItems)
    } catch (error) {
      console.error("Failed to load data:", error)
      showToast.error("Failed to load data. Please try again later.")
    }
  }

  const isActionItemValid = newActionItem.assignee && newActionItem.content.trim() !== ""

  const isSubmitEnabled = newCard.content.trim() !== ""
  const isActionItemSubmitEnabled = isActionItemValid

  // 计算 action items 的摘要信息
  const totalActionItems = actionItems.length
  const overdueTasks = actionItems.filter(item => !!item.dueDate).filter(item => new Date(item.dueDate) < startOfDay(new Date())).length

  const handleCardSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitEnabled && user) {
      try {
        const newCardData: RetroCard = { 
          ...newCard, 
          author: newCard.isAnonymous ? "Anonymous" : user.name, 
          likes: "", 
          createdAt: new Date().toISOString()
        }
        await retroService.saveCard(newCardData)
        setCards(await retroService.getCards())
        setNewCard({ type: "good", content: "", isAnonymous: false, createdAt: new Date().toISOString() })
        showToast.success("Card added successfully.")
      } catch (error) {
        console.error("Failed to add card:", error)
        showToast.error("Failed to add card. Please try again.")
      }
    }
  }

  const handleCardDelete = async (cardId: number) => {
    try {
      const updatedCards = cards.filter(card => card.id !== cardId)
      await retroService.deleteCard(cardId)
      setCards(updatedCards)
      showToast.success("Card deleted successfully.")
    } catch (error) {
      console.error("Failed to delete card:", error)
      showToast.error("Failed to delete card. Please try again.")
    }
  }

  const handleCardLike = async (cardId: number) => {
    if (!user) return
    try {
      const updatedCards = cards.map(card => {
        if (card.id === cardId) {
          const likesArray = card.likes ? card.likes.split(',') : []
          const newLikesArray = likesArray.includes(user.id)
            ? likesArray.filter(id => id !== user.id)
            : [...likesArray, user.id]
          return { ...card, likes: newLikesArray.join(',') }
        }
        return card
      })
      const updatedCard = updatedCards.find(card => card.id === cardId)
      if (!updatedCard) {
        throw new Error("无法找到要更新的卡片")
      }
      await retroService.updateCard(updatedCard)
      setCards(updatedCards)
      showToast.success("点赞状态已更新。")
    } catch (error) {
      console.error("更新点赞状态失败:", error)
      showToast.error("更新点赞状态失败。请重试。")
    }
  }

  const handleActionItemSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isActionItemSubmitEnabled) {
      try {
        if (editingActionItem) {
          const updatedActionItem = actionItems.find(item =>
            item.id === editingActionItem.id
          )
          if (!updatedActionItem) {
            throw new Error("无法找到要更新的 Action Item")
          }
          await retroService.updateActionItem(updatedActionItem)
        } else {
          await retroService.saveActionItem(newActionItem)
        }
        const updatedActionItems = await retroService.getActionItems()
        setActionItems(updatedActionItems)
        setNewActionItem({ assignee: "", dueDate: "", content: "" })
        setEditingActionItem(null)
        showToast.success(editingActionItem ? "Action item updated." : "New action item added.")
      } catch (error) {
        console.error(editingActionItem ? "Failed to update action item:" : "Failed to add action item:", error)
        showToast.error(editingActionItem ? "Failed to update action item. Please try again." : "Failed to add action item. Please try again.")
      }
    }
  }

  const handleActionItemDelete = async (itemId: number) => {
    try {
      await retroService.deleteActionItem(itemId)
      const updatedActionItems = actionItems.filter(item => item.id !== itemId)
      setActionItems(updatedActionItems)
      showToast.success("Action item deleted successfully.")
    } catch (error) {
      console.error("Failed to delete action item:", error)
      showToast.error("Failed to delete action item. Please try again.")
    }
  }

  const handleActionItemEdit = (item: ActionItem) => {
    setNewActionItem(item)
    setEditingActionItem(item)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setIsLoggedIn(false)
      setUser(null)
      router.push("/login")
      showToast.success("You have been successfully logged out.")
    } catch (error) {
      console.error("Logout failed:", error)
      showToast.error("Logout failed. Please try again.")
    }
  }

  const handleCardKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isSubmitEnabled) {
      handleCardSubmit()
    }
  }

  const handleActionItemKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter 用于换行，不需要特殊处理
        return;
      } else {
        // 仅 Enter 键用于提交
        e.preventDefault(); // 阻止默认的换行行为
        if (isActionItemSubmitEnabled) {
          handleActionItemSubmit();
        }
      }
    }
  }

  const handleClearBoard = async () => {
    try {
      await retroService.clearBoard()
      setCards([])
      showToast.success("Retro board cleared successfully.")
    } catch (error) {
      console.error("Failed to clear board:", error)
      showToast.error("Failed to clear board. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-[300px] space-y-5">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-8 w-[300px]" />
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isLoggedIn && (
        <div className="flex flex-col h-screen">
          <div className="relative flex justify-between items-center px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="headerPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#headerPattern)" />
              </svg>
            </div>
            <div className="flex items-center space-x-2 relative z-10">
              <Image
                src="/favicon.svg"
                alt="Retro Board Logo"
                width={32}
                height={32}
                className="text-white"
              />
              <h1 className="text-2xl font-bold font-heading text-white">Retro Board</h1>
            </div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white">Hello, {user?.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0] ?? '?'}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email ?? 'No email'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-white text-purple-500">
                {isSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </Button>
            </div>
          </div>
          <div className="flex justify-end p-4 gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Clear Board</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all retro cards from the board.
                    Action items will not be affected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearBoard}>Clear Board</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Select value={newCard.type} onValueChange={(value) => setNewCard({ ...newCard, type: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {typesInfo.map((typeInfo) => (
                  <SelectItem key={typeInfo.id} value={typeInfo.id} className="flex items-center">
                    <div className={`w-3 h-3 mr-2 ${typeInfo.indicatorColor} inline-block rounded-full`}></div>
                    <span className="inline">{typeInfo.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter your opinion"
              value={newCard.content}
              onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
              onKeyPress={handleCardKeyPress}
              className="flex-grow min-w-[200px]"
            />
            <div className="flex items-center">
              <Checkbox
                id="anonymous"
                checked={newCard.isAnonymous}
                onCheckedChange={(checked: boolean) => setNewCard({ ...newCard, isAnonymous: checked })}
              />
              <label htmlFor="anonymous" className="ml-2 hidden sm:inline">Anonymous</label>
            </div>
            <Button onClick={handleCardSubmit} disabled={!isSubmitEnabled}>Submit</Button>
          </div>
          <div className="flex flex-1 overflow-hidden">
            <ScrollArea className="flex-1 mr-4">
              <div className="grid grid-cols-4 gap-4 h-full">
                {typesInfo.map((column, index) => (
                  <div key={column.id} className={`${column.color} p-4 rounded-lg overflow-auto ${index === 0 ? 'ml-4' : ''}`}>
                    <h3 className="text-lg font-bold mb-2 font-heading">{column.title}</h3>
                    {cards.filter(card => card.type === column.id).map((card) => (
                      <Card key={card.id} className="mb-2 relative">
                        <div className="px-2 pt-0">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCardLike(card.id!)}
                                className={card.likes.split(',').includes(user?.id ?? "") ? "text-red-500" : ""}
                              >
                                <HeartIcon className="h-4 w-4" />
                              </Button>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex -space-x-2 ml-2">
                                      {
                                      card.likes.split(',').filter(id => id).map((userId) => {
                                        const likeUser = users.find(u => u.id === userId)
                                        if (likeUser) {
                                          return (
                                            <Avatar key={userId} className="w-6 h-6 border-2 border-background">
                                              <AvatarImage src={likeUser.avatar} alt={likeUser.name} />
                                              <AvatarFallback>{likeUser.name[0]}</AvatarFallback>
                                            </Avatar>
                                          )
                                        }
                                        return null
                                      })}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="flex flex-col">
                                      {card.likes.split(',').filter(id => id).map(userId => {
                                        const likeUser = users.find(u => u.id === userId)
                                        if (likeUser) {
                                          return (
                                            <div key={userId} className="flex items-center mb-2">
                                              <Avatar className="w-6 h-6 mr-2">
                                                <AvatarImage src={likeUser.avatar} alt={likeUser.name} />
                                                <AvatarFallback className="text-black">{likeUser.name?.[0] ?? '?'}</AvatarFallback>
                                              </Avatar>
                                              <span>{likeUser.name}</span>
                                            </div>
                                          )
                                        }
                                        return null
                                      })}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCardDelete(card.id!)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="pl-4 pr-4 pt-0 pb-1">
                          <p className="whitespace-pre-wrap break-words">{card.content}</p>
                        </CardContent>
                        <div className="px-4 pb-2">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{card.author}</span>
                            <span>{format(new Date(card.createdAt), "yyyy-MM-dd HH:mm")}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
            {isSidebarOpen && (
              <ScrollArea className="w-[300px] pr-4">
                <h3 className="text-lg font-bold mb-2 font-heading">Action Items</h3>
                <div className="mb-4 px-1">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Popover open={openAssignee} onOpenChange={setOpenAssignee}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openAssignee}
                        className="w-full justify-between"
                      >
                        {newActionItem.assignee
                          ? `${users.find((user) => user.id === newActionItem.assignee)?.name} (${newActionItem.assignee})`
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
                                  setNewActionItem({ ...newActionItem, assignee: user.id })
                                  setOpenAssignee(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newActionItem.assignee === user.id ? "opacity-100" : "opacity-0"
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="dueDate" variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newActionItem.dueDate ? format(new Date(newActionItem.dueDate), "yyyy-MM-dd") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newActionItem.dueDate ? new Date(newActionItem.dueDate) : undefined}
                        onSelect={(date: Date | undefined) => setNewActionItem({ ...newActionItem, dueDate: date?.toISOString() || '' })}
                        disabled={(date) => isBefore(date, startOfDay(new Date()))}
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
                    onClick={handleActionItemSubmit} 
                    disabled={!isActionItemSubmitEnabled}
                  >
                    {editingActionItem ? "Update" : "Add"} Action Item
                  </Button>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span>Total: <Badge variant="secondary">{totalActionItems}</Badge></span>
                    <span>Overdue: <Badge variant="destructive">{overdueTasks}</Badge></span>
                  </div>
                </div>
                <div>
                  {actionItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`mb-2 ${
                        new Date(item.dueDate) < startOfDay(new Date()) 
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
                            {users.find(user => user.id === item.assignee)?.name || 'Unassigned'}
                          </span>
                          <span className="text-xs text-muted-foreground">|</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {item.dueDate ? format(new Date(item.dueDate), "yyyy-MM-dd") : 'No due date'}
                          </span>
                        </div>
                        <div className="flex">
                          <Button variant="ghost" size="icon" onClick={() => handleActionItemEdit(item)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleActionItemDelete(item.id!)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          <div className="h-4"></div>
        </div>
      )}
    </div>
  )
}